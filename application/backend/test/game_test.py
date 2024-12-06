import random
import string
import unittest
import requests
import time


from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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
        
        # Give time for test to complete
        time.sleep(2)

    def test_game_controls(self):
        self.login_user()
        webdriverwait = WebDriverWait(self.driver, 10)

        webdriverwait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()

        # Navigate to game screen
        start_button = webdriverwait.until(
            EC.presence_of_element_located((By.ID, "start-round-button"))
        )
        start_button.click()

        garbage = webdriverwait.until(
            EC.presence_of_element_located((By.ID, "garbage-collector"))
        )

        # Get control settings
        left_key = self.driver.execute_script(
            "return JSON.parse(sessionStorage.getItem('user-metadata-state')).state.settings.moveLeft"
        )
        right_key = self.driver.execute_script(
            "return JSON.parse(sessionStorage.getItem('user-metadata-state')).state.settings.moveRight"
        )

        # Test left movement
        initial_left_pos = garbage.get_attribute("style")
        self.driver.find_element(By.TAG_NAME, "body").send_keys(left_key)
        time.sleep(0.5)  # Allow movement to complete
        final_left_pos = garbage.get_attribute("style")
        self.assertNotEqual(initial_left_pos, final_left_pos)

        # Test right movement
        initial_right_pos = garbage.get_attribute("style") 
        self.driver.find_element(By.TAG_NAME, "body").send_keys(right_key)
        time.sleep(0.5)  # Allow movement to complete
        final_right_pos = garbage.get_attribute("style")
        self.assertNotEqual(initial_right_pos, final_right_pos)


if __name__ == "__main__":
    unittest.main()