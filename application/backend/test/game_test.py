import random
import string
import unittest
import requests
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

    def test_start_game(self):
        self.login_user()
        webdriverwait = WebDriverWait(self.driver, 10)

        # Wait for game start button and click it
        start_button = webdriverwait.until(
            EC.presence_of_element_located((By.ID, "start-game-button"))
        )
        start_button.click()

        # Verify game interface is displayed
        game_interface = webdriverwait.until(
            EC.presence_of_element_located((By.ID, "game-interface"))
        )
        self.assertTrue(game_interface.is_displayed())

    def test_game_controls(self):
        self.login_user()
        webdriverwait = WebDriverWait(self.driver, 10)

        webdriverwait.until(
            EC.presence_of_element_located((By.ID, "play-nav-button"))
        ).click()

        # Navigate to game screen
        start_button = webdriverwait.until(
            EC.presence_of_element_located((By.ID, "start-game-button"))
        )
        start_button.click()


if __name__ == "__main__":
    unittest.main()