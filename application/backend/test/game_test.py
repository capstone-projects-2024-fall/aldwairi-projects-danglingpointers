import random
import string
import unittest
import requests
import time


from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

class GameTest(unittest.TestCase):
    
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.base_url = "http://localhost:3000"
        self.api_url = "http://localhost:8000/api"
        # Test user credentials
        self.test_username = "johndoe"
        self.test_password = "password1"

    def tearDown(self):
        self.driver.quit()


    def login_user(self):
        """Helper method to login before testing game features"""
        self.driver.get(self.base_url)
        webdriverwait = WebDriverWait(self.driver, 10)
        
        webdriverwait.until(
            EC.presence_of_element_located((By.ID, "login-username-input"))
        )
        
        self.driver.find_element(By.ID, "login-username-input").send_keys(self.test_username)
        self.driver.find_element(By.ID, "login-password-input").send_keys(self.test_password)
        self.driver.find_element(By.ID, "login-submit-button").click()

    def start_game(self):
        """Helper method to handle common game start sequence"""
        self.login_user()
        webdriverwait = WebDriverWait(self.driver, 10)
        webdriverwait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
        start_button = webdriverwait.until(EC.presence_of_element_located((By.ID, "start-round-button")))
        start_button.click()
        return webdriverwait
    
    def test_start_game(self):
        webdriverwait = self.start_game()

        # Get initial stack state
        stack = webdriverwait.until(EC.presence_of_element_located((By.CLASS_NAME, "stack")))
        memory1_initial = stack.find_elements(By.CLASS_NAME, "memory.memory1")[0]
        initial_position = memory1_initial.location

        # Wait until memory position changes
        webdriverwait.until(
            lambda driver: stack.find_elements(By.CLASS_NAME, "memory.memory1")[0].location != initial_position
        )

        # Get updated position
        memory1_updated = stack.find_elements(By.CLASS_NAME, "memory.memory1")[0]  
        updated_position = memory1_updated.location

        # Verify position changed
        self.assertNotEqual(initial_position, updated_position, "Memory1 position should change after game starts")

    def test_game_controls(self):
        webdriverwait = self.start_game()

        # Wait for stack initialization and garbage collector
        stack = webdriverwait.until(EC.presence_of_element_located((By.CLASS_NAME, "stack")))
        garbage = webdriverwait.until(EC.presence_of_element_located((By.ID, "garbage-collector")))
        
        # Click game area to focus
        game_area = self.driver.find_element(By.CLASS_NAME, "game")
        actions = ActionChains(self.driver)
        actions.move_to_element(game_area).click().perform()

        # Test left movement
        initial_left_pos = garbage.get_attribute("style")
        actions.key_down(Keys.ARROW_LEFT).pause(1).key_up(Keys.ARROW_LEFT).perform()
        time.sleep(1)
        final_left_pos = garbage.get_attribute("style")
        self.assertNotEqual(initial_left_pos, final_left_pos)

        # Test right movement  
        initial_right_pos = garbage.get_attribute("style")
        actions.key_down(Keys.ARROW_RIGHT).pause(1).key_up(Keys.ARROW_RIGHT).perform()
        time.sleep(1)
        final_right_pos = garbage.get_attribute("style")
        self.assertNotEqual(initial_right_pos, final_right_pos)

    def test_game_score(self):
        
        # Try different pause durations
        pause_times = [0.011, 0.012, 0.013, 0.014, 0.015]
        self.login_user()
        
        for pause_duration in pause_times:
            self.driver.refresh()
            webdriverwait = WebDriverWait(self.driver, 10)
            webdriverwait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
            start_button = webdriverwait.until(EC.presence_of_element_located((By.ID, "start-round-button")))
            start_button.click()
                # Wait for stack initialization and garbage collector
            stack = webdriverwait.until(EC.presence_of_element_located((By.CLASS_NAME, "stack")))
            garbage = webdriverwait.until(EC.presence_of_element_located((By.ID, "garbage-collector")))
            
            # Click game area to focus
            game_area = self.driver.find_element(By.CLASS_NAME, "game")
            actions = ActionChains(self.driver)
            actions.move_to_element(game_area).click().perform()

            # Wait for a pointer to appear
            pointer = webdriverwait.until(EC.presence_of_element_located((By.CLASS_NAME, "pointer")))
            initial_score = (self.driver.find_element(By.ID, "game-score").text)
            
            attempts = 0
            while attempts < 17:  # Limit attempts per pause duration
                print(initial_score)
                actions.key_down(Keys.ARROW_LEFT).pause(pause_duration).key_up(Keys.ARROW_LEFT).perform()
                time.sleep(0.13)
                
                final_score = (self.driver.find_element(By.ID, "game-score").text)
                print(final_score)
                if final_score != initial_score:
                    return  # Test passed - we found a working timing
                    
                attempts += 1
                
        self.fail("Could not achieve score increase with any timing")

    def test_versus_gameplay(self):
        driver1 = webdriver.Chrome()
        driver2 = webdriver.Chrome()

        # User 1 logs in (Bobby)
        driver1.get(self.base_url)
        webdriverwait1 = WebDriverWait(driver1, 10)
        webdriverwait1.until(EC.presence_of_element_located((By.ID, "login-username-input")))
        driver1.find_element(By.ID, "login-username-input").send_keys("bobby")
        driver1.find_element(By.ID, "login-password-input").send_keys("password_bob")
        driver1.find_element(By.ID, "login-submit-button").click()

        webdriverwait1.until(EC.presence_of_element_located((By.ID, "home-nav-button"))).click()

        # User 2 logs in (Alicey)
        driver2.get(self.base_url)
        webdriverwait2 = WebDriverWait(driver2, 10)
        webdriverwait2.until(EC.presence_of_element_located((By.ID, "login-username-input")))
        driver2.find_element(By.ID, "login-username-input").send_keys("alicey")
        driver2.find_element(By.ID, "login-password-input").send_keys("password_alicey")
        driver2.find_element(By.ID, "login-submit-button").click()

        webdriverwait2.until(EC.presence_of_element_located((By.ID, "home-nav-button"))).click()

        # User 1 starts game
        webdriverwait1.until(EC.presence_of_element_located((By.ID, "create-game-button"))).click()

        # User 2 joins game
        webdriverwait2.until(EC.presence_of_element_located((By.ID, "join-game"))).click()

                # Get initial stack state
        stack = webdriverwait1.until(EC.presence_of_element_located((By.CLASS_NAME, "stack")))
        memory1_initial = stack.find_elements(By.CLASS_NAME, "memory.memory1")[0]
        initial_position = memory1_initial.location

        # Wait until memory position changes
        webdriverwait1.until(
            lambda driver: stack.find_elements(By.CLASS_NAME, "memory.memory1")[0].location != initial_position
        )

        # Get updated position
        memory1_updated = stack.find_elements(By.CLASS_NAME, "memory.memory1")[0]  
        updated_position = memory1_updated.location

        # Verify position changed
        self.assertNotEqual(initial_position, updated_position, "Memory1 position should change after game starts")

                # Get initial stack state
        stack = webdriverwait2.until(EC.presence_of_element_located((By.CLASS_NAME, "stack")))
        memory1_initial = stack.find_elements(By.CLASS_NAME, "memory.memory1")[0]
        initial_position = memory1_initial.location

        # Wait until memory position changes
        webdriverwait2.until(
            lambda driver: stack.find_elements(By.CLASS_NAME, "memory.memory1")[0].location != initial_position
        )

        # Get updated position
        memory1_updated = stack.find_elements(By.CLASS_NAME, "memory.memory1")[0]  
        updated_position = memory1_updated.location

        # Verify position changed
        self.assertNotEqual(initial_position, updated_position, "Memory1 position should change after game starts")



    


if __name__ == "__main__":
    unittest.main()