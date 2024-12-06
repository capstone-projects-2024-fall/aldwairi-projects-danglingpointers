import random
import string
import unittest
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class UserAccountTest(unittest.TestCase):
    
    def setUp(self):
        def generate_random_string(length):
            letters = string.ascii_letters
            result_str = ''.join(random.choice(letters) for i in range(length))
            return result_str
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.base_url = "http://localhost:3000"
        self.api_url = "http://localhost:8000/api"
        self.test_logusername = "johndoe"
        self.test_logpassword = "password1"
        self.test_username1 = "bobby"
        self.test_password1 = "password1"
        self.test_username2 = "alicey"
        self.test_password2 = "password2"
        self.test_regusername = generate_random_string(20)
        self.test_regpassword = generate_random_string(20)

    def tearDown(self): 
        self.driver.quit()
    
    def deleteUser(self):
        # Delete test user
        try:
            response = requests.post(
                f"{self.api_url}/remove-user/",
                json={
                    
                    "username": self.test_username,
                    "password": self.test_password
                }
            )
            if response.status_code != 200:
                print(f"Failed to delete test user: {response.json()}")
        except Exception as e:
            print(f"Error deleting test user: {str(e)}")
        

    def test_account_creation(self):
        #self.deleteUser()
        self.driver.get(self.base_url)
        webdriverwait = WebDriverWait(self.driver, 10)

        webdriverwait.until(
            EC.presence_of_element_located((By.ID, "login-username-input"))
        )
        
        self.driver.find_element(By.ID,"login-username-input").send_keys(self.test_regusername)
        self.driver.find_element(By.ID,"login-password-input").send_keys(self.test_regpassword)
        self.driver.find_element(By.ID,"login-submit-button").click()

        webdriverwait.until(
            EC.presence_of_element_located((By.ID, "security-answer"))
        )

        self.driver.find_element(By.ID,"security-answer-input").send_keys("elmstreet")
        self.driver.find_element(By.ID,"security-submit-button").click()

        watch_title = webdriverwait.until(
            EC.presence_of_element_located((By.ID, "watch-title"))
        )
        
        self.assertTrue(watch_title.is_displayed())

    def test_account_login(self):
        self.driver.get(self.base_url)
        webdriverwait = WebDriverWait(self.driver, 10)

        webdriverwait.until(
            EC.presence_of_element_located((By.ID, "login-username-input"))
        )
        
        self.driver.find_element(By.ID,"login-username-input").send_keys(self.test_logusername)
        self.driver.find_element(By.ID,"login-password-input").send_keys(self.test_logpassword)
        self.driver.find_element(By.ID,"login-submit-button").click()

        watch_title = webdriverwait.until(
            EC.presence_of_element_located((By.ID, "watch-title"))
        )
        
        self.assertTrue(watch_title.is_displayed())

    def test_account_logout(self):
        self.driver.get(self.base_url)
        webdriverwait = WebDriverWait(self.driver, 10)

        webdriverwait.until(
            EC.presence_of_element_located((By.ID, "login-username-input"))
        )
        
        self.driver.find_element(By.ID,"login-username-input").send_keys(self.test_logusername)
        self.driver.find_element(By.ID,"login-password-input").send_keys(self.test_logpassword)
        self.driver.find_element(By.ID,"login-submit-button").click()

        watch_title = webdriverwait.until(
            EC.presence_of_element_located((By.ID, "watch-title"))
        )
        
        self.assertTrue(watch_title.is_displayed())

        self.driver.find_element(By.ID,"logout-nav-button").click()

        login = webdriverwait.until(
            EC.presence_of_element_located((By.ID, "login-username-input"))
        )

        self.assertTrue(login.is_displayed())

    # def test_send_message(self):
    #     driver1 = webdriver.Chrome()
    #     driver2 = webdriver.Chrome()
        
    #     try:
    #         self.test_account_creation(driver1, self.test_username1, self.test_password1)
    #         self.test_account_creation(driver2, self.test_username2, self.test_password2)

    #         # User 1 logs in
    #         self.driver.get(self.base_url)
    #         webdriverwait = WebDriverWait(self.driver, 10)

    #         webdriverwait.until(
    #             EC.presence_of_element_located((By.ID, "login-username-input"))
    #         )
            
    #         self.driver.find_element(By.ID, "login-username-input").send_keys(self.test_logusername)
    #         self.driver.find_element(By.ID, "login-password-input").send_keys(self.test_logpassword)
    #         self.driver.find_element(By.ID, "login-submit-button").click()

    #         watch_title = webdriverwait.until(
    #             EC.presence_of_element_located((By.ID, "watch-title"))
    #         )
            
    #         self.assertTrue(watch_title.is_displayed())

    #         self.driver.find_element(By.ID, "message-input").send_keys("Hello User 2")
    #         self.driver.find_element(By.ID, "send-message-button").click()

    #         self.driver.find_element(By.ID, "logout-nav-button").click()

    #         self.driver.find_element(By.ID, "login-username-input").send_keys(self.test_logusername2)
    #         self.driver.find_element(By.ID, "login-password-input").send_keys(self.test_logpassword2)
    #         self.driver.find_element(By.ID, "login-submit-button").click()

    #         self.driver.find_element(By.ID, "message-input").send_keys("Hello User 1")
    #         self.driver.find_element(By.ID, "send-message-button").click()

    #         self.driver.find_element(By.ID, "logout-nav-button").click()

    #         self.driver.find_element(By.ID, "login-username-input").send_keys(self.test_logusername)
    #         self.driver.find_element(By.ID, "login-password-input").send_keys(self.test_logpassword)
    #         self.driver.find_element(By.ID, "login-submit-button").click()

    #         message_received = webdriverwait.until(
    #             EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Hello User 1')]"))
    #         )
            
    #         self.assertTrue(message_received.is_displayed())
    #     finally:
    #         driver1.quit()
    #         driver2.quit()
if __name__ == "__main__":
    unittest.main()