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
        self.test_username = "testuser12"
        self.test_password = "password12"

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

        webdriverwait.until(EC.presence_of_element_located((By.ID, "inbox-component")))

    def start_game(self):
        """Helper method to handle common game start sequence"""
        self.login_user()
        webdriverwait = WebDriverWait(self.driver, 10)
        webdriverwait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
        start_button = webdriverwait.until(EC.presence_of_element_located((By.ID, "start-round-button")))
        start_button.click()
        return webdriverwait
    
    def test_start_game(self):
        print("\n=== Starting Game Initialization Test ===")
        print("1. Starting game session...")
        webdriverwait = self.start_game()
        print(" Game session started")

        print("2. Getting initial stack state...")
        stack = webdriverwait.until(EC.presence_of_element_located((By.CLASS_NAME, "stack")))
        memory1_initial = stack.find_elements(By.CLASS_NAME, "memory.memory1")[0]
        initial_position = memory1_initial.location
        print(" Initial position captured")

        print("3. Waiting for memory movement...")
        webdriverwait.until(
            lambda driver: stack.find_elements(By.CLASS_NAME, "memory.memory1")[0].location != initial_position
        )
        print(" Memory movement detected")

        print("4. Verifying position change...")
        memory1_updated = stack.find_elements(By.CLASS_NAME, "memory.memory1")[0]  
        updated_position = memory1_updated.location
        self.assertNotEqual(initial_position, updated_position, "Memory1 position should change after game starts")
        print(" Position change verified")
        print("=== Game Initialization Test Completed Successfully ===\n")

    def test_game_controls(self):
        print("\n=== Starting Game Controls Test ===")
        print("1. Starting game session...")
        webdriverwait = self.start_game()
        print(" Game session started")

        print("2. Setting up game elements...")
        stack = webdriverwait.until(EC.presence_of_element_located((By.CLASS_NAME, "stack")))
        garbage = webdriverwait.until(EC.presence_of_element_located((By.ID, "garbage-collector")))
        print(" Game elements loaded")
        
        print("3. Setting up game focus...")
        game_area = self.driver.find_element(By.CLASS_NAME, "game")
        actions = ActionChains(self.driver)
        actions.move_to_element(game_area).click().perform()
        print(" Game focus set")

        print("4. Testing left movement...")
        initial_left_pos = garbage.get_attribute("style")
        actions.key_down(Keys.ARROW_LEFT).pause(1).key_up(Keys.ARROW_LEFT).perform()
        time.sleep(1)
        final_left_pos = garbage.get_attribute("style")
        self.assertNotEqual(initial_left_pos, final_left_pos)
        print(" Left movement verified")

        print("5. Testing right movement...")
        initial_right_pos = garbage.get_attribute("style")
        actions.key_down(Keys.ARROW_RIGHT).pause(1).key_up(Keys.ARROW_RIGHT).perform()
        time.sleep(1)
        final_right_pos = garbage.get_attribute("style")
        self.assertNotEqual(initial_right_pos, final_right_pos)
        print(" Right movement verified")
        print("=== Game Controls Test Completed Successfully ===\n")

    def test_game_score(self):
        print("\n=== Starting Game Score Test ===")
        print("1. Setting up test parameters...")
        pause_times = [0.011, 0.012, 0.013, 0.014, 0.015]
        print(f" Testing pause durations: {pause_times}")
        
        print("2. Logging in user...")
        self.login_user()
        print(" User logged in")
        
        for pause_duration in pause_times:
            print(f"\n3. Testing with pause duration: {pause_duration}")
            self.driver.refresh()
            webdriverwait = WebDriverWait(self.driver, 10)
            
            print("4. Starting game round...")
            webdriverwait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
            start_button = webdriverwait.until(EC.presence_of_element_located((By.ID, "start-round-button")))
            start_button.click()
            print(" Game round started")

            print("5. Setting up game elements...")
            stack = webdriverwait.until(EC.presence_of_element_located((By.CLASS_NAME, "stack")))
            garbage = webdriverwait.until(EC.presence_of_element_located((By.ID, "garbage-collector")))
            print(" Game elements loaded")
            
            print("6. Setting game focus...")
            game_area = self.driver.find_element(By.CLASS_NAME, "game")
            actions = ActionChains(self.driver)
            actions.move_to_element(game_area).click().perform()
            print(" Game focus set")

            print("7. Waiting for pointer...")
            pointer = webdriverwait.until(EC.presence_of_element_located((By.CLASS_NAME, "pointer")))
            initial_score = (self.driver.find_element(By.ID, "game-score").text)
            print(f" Initial score: {initial_score}")
            
            attempts = 0
            print("8. Testing score increase...")
            while attempts < 17:
                actions.key_down(Keys.ARROW_LEFT).pause(pause_duration).key_up(Keys.ARROW_LEFT).perform()
                time.sleep(0.13)
                
                final_score = (self.driver.find_element(By.ID, "game-score").text)
                if final_score != initial_score:
                    print(f" Score increased from {initial_score} to {final_score}")
                    print("=== Game Score Test Completed Successfully ===\n")
                    return
                    
                attempts += 1
                print(f"   Attempt {attempts}: Score remains {final_score}")
            
        self.fail("Could not achieve score increase with any timing")
        print("=== Game Score Test Failed ===\n")

    def test_versus_gameplay(self):
        print("\n=== Starting Versus Gameplay Test ===")
        print("1. Setting up test environment...")
        driver1 = webdriver.Chrome()
        driver2 = webdriver.Chrome()
        print(" Browser instances created")

        try:
            print("2. Logging in Player 1 (Bobby)...")
            driver1.get(self.base_url)
            webdriverwait1 = WebDriverWait(driver1, 10)
            webdriverwait1.until(EC.presence_of_element_located((By.ID, "login-username-input")))
            driver1.find_element(By.ID, "login-username-input").send_keys("bobby")
            driver1.find_element(By.ID, "login-password-input").send_keys("password_bob")
            driver1.find_element(By.ID, "login-submit-button").click()
            print(" Player 1 logged in")

            print("3. Navigating to home screen for Player 1...")
            webdriverwait1.until(EC.presence_of_element_located((By.ID, "inbox-component")))
            webdriverwait1.until(EC.presence_of_element_located((By.ID, "home-nav-button"))).click()
            print(" Player 1 at home screen")

            print("4. Logging in Player 2 (Alicey)...")
            driver2.get(self.base_url)
            webdriverwait2 = WebDriverWait(driver2, 10)
            webdriverwait2.until(EC.presence_of_element_located((By.ID, "login-username-input")))
            driver2.find_element(By.ID, "login-username-input").send_keys("alicey")
            driver2.find_element(By.ID, "login-password-input").send_keys("password_alicey")
            driver2.find_element(By.ID, "login-submit-button").click()
            print(" Player 2 logged in")

            print("5. Starting versus game...")
            webdriverwait1.until(EC.presence_of_element_located((By.ID, "create-game-button"))).click()
            webdriverwait1.until(EC.presence_of_element_located((By.ID, "startv-game"))).click()
            print(" Game created by Player 1")

            print("6. Player 2 joining game...")
            webdriverwait2.until(EC.presence_of_element_located((By.ID, "inbox-component")))
            webdriverwait2.until(EC.presence_of_element_located((By.ID, "home-nav-button"))).click()
            webdriverwait2.until(EC.presence_of_element_located((By.ID, "join-game"))).click()
            print(" Player 2 joined game")

            print("7. Setting up game for both players...")
            for i, (driver, wait) in enumerate([(driver1, webdriverwait1), (driver2, webdriverwait2)], 1):
                print(f"   Setting up Player {i}...")
                stack = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "stack")))
                garbage = wait.until(EC.presence_of_element_located((By.ID, "garbage-collector")))
                game_area = driver.find_element(By.CLASS_NAME, "game")
                actions = ActionChains(driver)
                actions.move_to_element(game_area).click().perform()
                print(f" Player {i} setup complete")

            print("8. Verifying pointers for both players...")
            pointer1 = webdriverwait1.until(EC.presence_of_element_located((By.CLASS_NAME, "pointer")))
            pointer2 = webdriverwait2.until(EC.presence_of_element_located((By.CLASS_NAME, "pointer")))
            
            self.assertTrue(pointer1.is_displayed() and pointer2.is_displayed(),
                           "Both players should see pointers spawn")
            print(" Both players' pointers verified")
            print("=== Versus Gameplay Test Completed Successfully ===\n")

        finally:
            print("Cleaning up test environment...")
            driver1.quit()
            driver2.quit()
            print(" Test environment cleaned up")

    def test_powerup(self):
        print("\n=== Starting Power-Up Test ===")
        print("1. Starting game session...")
        webdriverwait = self.start_game()
        print(" Game session started")
        
        print("2. Setting up game controls...")
        userin = self.driver.find_element(By.TAG_NAME, "body")
        userin.send_keys(Keys.TAB)
        userin.send_keys(Keys.TAB)
        print(" Game controls configured")

        print("3. Getting initial lives count...")
        lives_element = webdriverwait.until(EC.presence_of_element_located(
            (By.CLASS_NAME, "lives-remaining")))
        hearts_before = lives_element.text.count("❤️")
        print(f" Initial lives count: {hearts_before}")

        print("4. Triggering power-up...")
        userin.send_keys(Keys.ENTER)
        print(" Power-up activated")

        print("5. Verifying lives increase...")
        hearts_after = lives_element.text.count("❤️")
        self.assertEqual(hearts_after, hearts_before + 1, 
                        f"Hearts did not increase as expected. Before: {hearts_before}, After: {hearts_after}")
        print(f" Lives increased from {hearts_before} to {hearts_after}")
        print("=== Power-Up Test Completed Successfully ===\n")
    
if __name__ == "__main__":
    unittest.main()