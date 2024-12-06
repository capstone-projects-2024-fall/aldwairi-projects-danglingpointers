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


if __name__ == "__main__":
    unittest.main()