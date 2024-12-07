import random
import string
import time
import unittest
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains

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
        self.test_logusername = "testuser12"
        self.test_logpassword = "password12"

        self.test_regusername = generate_random_string(20)
        self.test_regpassword = generate_random_string(20)
        self.wait = WebDriverWait(self.driver, 20)
        self.actions = ActionChains(self.driver)

    def tearDown(self): 
        self.driver.quit()
    
    def get_message_id(sender, message):
        truncated = message[:10].replace(" ", "-")
        return f"message-{sender}-{truncated}"
    
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
            EC.presence_of_element_located((By.ID, "inbox-component"))
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
            EC.presence_of_element_located((By.CLASS_NAME, "watchtitle"))
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
            EC.presence_of_element_located((By.CLASS_NAME, "watchtitle"))
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
        message_id = UserAccountTest.get_message_id("bobby", message_text)

        received_message = webdriverwait2.until(
            EC.presence_of_element_located((By.ID, message_id))
        )
        
        self.assertTrue(received_message.is_displayed())
        time.sleep(3)
        # User 2 replies to User 1
        reply_text = "Hello Bobby!"
        reply_input = webdriverwait2.until(EC.presence_of_element_located((By.CLASS_NAME, "message-input")))
        reply_input.send_keys(reply_text)
        reply_button = driver2.find_element(By.CLASS_NAME, "send-btn")
        reply_button.click()

        # User 1 checks the received reply
        reply_message_id = UserAccountTest.get_message_id("alicey", reply_text)
        received_reply = webdriverwait1.until(
            EC.presence_of_element_located((By.ID, reply_message_id))
        )
        self.assertTrue(received_reply.is_displayed())

    def test_click_specific_color(self):
        self.driver.get(self.base_url)
        webdriverwait = WebDriverWait(self.driver, 10)

        webdriverwait.until(
            EC.presence_of_element_located((By.ID, "login-username-input"))
        )
        
        self.driver.find_element(By.ID,"login-username-input").send_keys(self.test_logusername)
        self.driver.find_element(By.ID,"login-password-input").send_keys(self.test_logpassword)
        self.driver.find_element(By.ID,"login-submit-button").click()
        
        # Navigate to dashboard
        webdriverwait.until(EC.presence_of_element_located((By.ID, "dashboard-nav-button"))).click()
        
        # Click edit button
        edit_button = webdriverwait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "button[style*='background-color: blue']")))
        edit_button.click()
        
        # Select color
        color_div = webdriverwait.until(EC.presence_of_element_located(
            (By.XPATH, "//div[contains(@style, 'background: rgb(121, 133, 210)')]")))
        
        self.driver.execute_script("arguments[0].click();", color_div)
        self.actions.move_to_element(color_div).click().perform()
        
        # Save settings
        save_button = self.driver.find_element(By.CSS_SELECTOR, "button[style*='background-color: green']")
        save_button.click()
        
        # Navigate to play page and verify color
        webdriverwait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
        time.sleep(1)
        
        garbage_collector = webdriverwait.until(EC.presence_of_element_located((By.ID, "garbage-collector")))
        rgba_color = garbage_collector.value_of_css_property("background-color")
        
        # Convert rgba to rgb if needed
        if (rgba_color.startswith("rgba")):
            rgba_values = rgba_color[5:-1].split(",")
            rgb_color = f"rgb({rgba_values[0].strip()}, {rgba_values[1].strip()}, {rgba_values[2].strip()})"
        else:
            rgb_color = rgba_color
        
        expected_color = "rgb(121, 133, 210)"
        self.assertEqual(rgb_color, expected_color, 
                        f"Color mismatch! Expected {expected_color}, but got {rgb_color}.")

    def test_settings_and_play_with_movement(self):
        self.driver.get(self.base_url)
        webdriverwait = WebDriverWait(self.driver, 10)

        webdriverwait.until(
            EC.presence_of_element_located((By.ID, "login-username-input"))
        )
        
        self.driver.find_element(By.ID,"login-username-input").send_keys(self.test_logusername)
        self.driver.find_element(By.ID,"login-password-input").send_keys(self.test_logpassword)
        self.driver.find_element(By.ID,"login-submit-button").click()
        
        # Navigate to settings
        webdriverwait.until(EC.presence_of_element_located((By.ID, "dashboard-nav-button"))).click()
        edit_button = self.wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "button[style*='background-color: blue']")))
        edit_button.click()
        
        # Set movement keys
        move_left_input = self.driver.find_element(By.XPATH, "//li[contains(., 'Move Left')]/input")
        move_left_input.click()
        self.actions.send_keys("a").perform()

        move_right_input = self.driver.find_element(By.XPATH, "//li[contains(., 'Move Right')]/input")
        move_right_input.click()
        self.actions.send_keys("d").perform()
        
        # Save settings
        save_button = self.driver.find_element(By.CSS_SELECTOR, "button[style*='background-color: green']")
        save_button.click()
        
        # Test movement in game
        webdriverwait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
        start_round_button = webdriverwait.until(EC.presence_of_element_located((By.ID, "start-round-button")))
        start_round_button.click()

        garbage = webdriverwait.until(EC.presence_of_element_located((By.ID, "garbage-collector")))

        # Get initial position before any movement
        initial_pos = garbage.get_attribute("style")

        # Test left movement
        self.actions.key_down("a").pause(1).key_up("a").perform()
        time.sleep(1)
        left_pos = garbage.get_attribute("style")
        self.assertNotEqual(initial_pos, left_pos, "Garbage collector did not move left")

        # Test right movement  
        self.actions.key_down("d").pause(1).key_up("d").perform()
        time.sleep(1)
        right_pos = garbage.get_attribute("style") 
        self.assertNotEqual(left_pos, right_pos, "Garbage collector did not move right")

        print("Custom key movement tests passed.")

if __name__ == "__main__":
    unittest.main()
