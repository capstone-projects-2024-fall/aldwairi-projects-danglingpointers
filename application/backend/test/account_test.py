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

    def test_send_message(self):
        driver1 = webdriver.Chrome()
        driver2 = webdriver.Chrome()
        
        try:
            # User 1 logs in (Bobby)
            driver1.get(self.base_url)
            webdriverwait1 = WebDriverWait(driver1, 10)
            webdriverwait1.until(EC.presence_of_element_located((By.ID, "login-username-input")))
            driver1.find_element(By.ID, "login-username-input").send_keys("bobby")
            driver1.find_element(By.ID, "login-password-input").send_keys("password_bob")
            driver1.find_element(By.ID, "login-submit-button").click()

            # User 2 logs in (Alicey)
            driver2.get(self.base_url)
            webdriverwait2 = WebDriverWait(driver2, 10)
            webdriverwait2.until(EC.presence_of_element_located((By.ID, "login-username-input")))
            driver2.find_element(By.ID, "login-username-input").send_keys("alicey")
            driver2.find_element(By.ID, "login-password-input").send_keys("password_alicey")
            driver2.find_element(By.ID, "login-submit-button").click()

            # User 1 clicks the triangle to open the inbox
            triangle_icon = webdriverwait1.until(
                EC.presence_of_element_located((By.XPATH, "//div[@style='cursor: pointer;']"))
            )
            triangle_icon.click()

            # User 1 sends a message to User 2
            message_text = "Hello Alicey!"
            message_input = webdriverwait1.until(EC.presence_of_element_located((By.CLASS_NAME, "message-input")))
            message_input.send_keys(message_text)
            send_button = driver1.find_element(By.CLASS_NAME, "send-btn")
            send_button.click()

            # User 2 clicks the triangle to open the inbox
            triangle_icon_user2 = webdriverwait2.until(
                EC.presence_of_element_located((By.XPATH, "//div[@style='cursor: pointer;']"))
            )
            triangle_icon_user2.click()

            # User 2 checks the received message
            received_message = webdriverwait2.until(
                EC.presence_of_element_located((By.XPATH, f"//div[contains(text(), '{message_text}')]"))
            )
            self.assertTrue(received_message.is_displayed())

            # User 2 replies to User 1
            reply_text = "Hello Bobby!"
            reply_input = webdriverwait2.until(EC.presence_of_element_located((By.CLASS_NAME, "message-input")))
            reply_input.send_keys(reply_text)
            reply_button = driver2.find_element(By.CLASS_NAME, "send-btn")
            reply_button.click()

            # User 1 checks the received reply
            received_reply = webdriverwait1.until(
                EC.presence_of_element_located((By.XPATH, f"//div[contains(text(), '{reply_text}')]"))
            )
            self.assertTrue(received_reply.is_displayed())

        finally:
            # return
            driver1.quit()
            driver2.quit()



if __name__ == "__main__":
    test = UserAccountTest()
    test.setUp()
    test.test_send_message()
    test.tearDown()