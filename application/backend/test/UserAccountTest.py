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
        print("\n=== Starting Account Creation Test ===")
        print("1. Loading application homepage...")
        self.driver.get(self.base_url)
        webdriverwait = WebDriverWait(self.driver, 10)

        print("2. Waiting for login form...")
        webdriverwait.until(EC.presence_of_element_located((By.ID, "login-username-input")))
        print(" Login form loaded")
        
        print("3. Entering registration credentials...")
        self.driver.find_element(By.ID,"login-username-input").send_keys(self.test_regusername)
        self.driver.find_element(By.ID,"login-password-input").send_keys(self.test_regpassword)
        self.driver.find_element(By.ID,"login-submit-button").click()
        print(" Registration form submitted")

        print("4. Setting up security answer...")
        webdriverwait.until(EC.presence_of_element_located((By.ID, "security-answer")))
        self.driver.find_element(By.ID,"security-answer-input").send_keys("elmstreet")
        self.driver.find_element(By.ID,"security-submit-button").click()
        print(" Security answer submitted")

        print("5. Verifying successful registration...")
        watch_title = webdriverwait.until(EC.presence_of_element_located((By.ID, "inbox-component")))
        self.assertTrue(watch_title.is_displayed())
        print(" Registration verified")
        print("=== Account Creation Test Completed Successfully ===\n")

    def test_account_login(self):
        print("\n=== Starting Account Login Test ===")
        print("1. Loading application homepage...")
        self.driver.get(self.base_url)
        webdriverwait = WebDriverWait(self.driver, 10)

        print("2. Waiting for login form...")
        webdriverwait.until(EC.presence_of_element_located((By.ID, "login-username-input")))
        print(" Login form loaded")
        
        print("3. Entering login credentials...")
        self.driver.find_element(By.ID,"login-username-input").send_keys(self.test_logusername)
        self.driver.find_element(By.ID,"login-password-input").send_keys(self.test_logpassword)
        self.driver.find_element(By.ID,"login-submit-button").click()
        print(" Login credentials submitted")

        print("4. Verifying successful login...")
        watch_title = webdriverwait.until(EC.presence_of_element_located((By.CLASS_NAME, "watchtitle")))
        self.assertTrue(watch_title.is_displayed())
        print(" Login successful")
        print("=== Account Login Test Completed Successfully ===\n")

    def test_account_logout(self):
        print("\n=== Starting Account Logout Test ===")
        print("1. Loading application homepage...")
        self.driver.get(self.base_url)
        webdriverwait = WebDriverWait(self.driver, 10)

        print("2. Logging in user...")
        webdriverwait.until(EC.presence_of_element_located((By.ID, "login-username-input")))
        self.driver.find_element(By.ID,"login-username-input").send_keys(self.test_logusername)
        self.driver.find_element(By.ID,"login-password-input").send_keys(self.test_logpassword)
        self.driver.find_element(By.ID,"login-submit-button").click()
        print(" User logged in")

        print("3. Verifying login success...")
        watch_title = webdriverwait.until(EC.presence_of_element_located((By.CLASS_NAME, "watchtitle")))
        self.assertTrue(watch_title.is_displayed())
        print(" Login verified")

        print("4. Performing logout...")
        self.driver.find_element(By.ID,"logout-nav-button").click()
        print(" Logout clicked")

        print("5. Verifying successful logout...")
        login = webdriverwait.until(EC.presence_of_element_located((By.ID, "login-username-input")))
        self.assertTrue(login.is_displayed())
        print(" Logout verified")
        print("=== Account Logout Test Completed Successfully ===\n")

    def test_send_message(self):
        print("\n=== Starting Message Send Test ===")
        print("1. Setting up test environment...")
        driver1 = webdriver.Chrome()
        driver2 = webdriver.Chrome()
        print(" Browser instances created")
        
        try:
            print("2. Logging in User 1 (Bobby)...")
            driver1.get(self.base_url)
            webdriverwait1 = WebDriverWait(driver1, 10)
            webdriverwait1.until(EC.presence_of_element_located((By.ID, "login-username-input")))
            driver1.find_element(By.ID, "login-username-input").send_keys("bobby")
            driver1.find_element(By.ID, "login-password-input").send_keys("password_bob")
            driver1.find_element(By.ID, "login-submit-button").click()
            print(" User 1 logged in")

            print("3. Logging in User 2 (Alicey)...")
            driver2.get(self.base_url)
            webdriverwait2 = WebDriverWait(driver2, 10)
            webdriverwait2.until(EC.presence_of_element_located((By.ID, "login-username-input")))
            driver2.find_element(By.ID, "login-username-input").send_keys("alicey")
            driver2.find_element(By.ID, "login-password-input").send_keys("password_alicey")
            driver2.find_element(By.ID, "login-submit-button").click()
            print(" User 2 logged in")

            print("4. Opening User 1's inbox...")
            triangle_icon = webdriverwait1.until(
                EC.presence_of_element_located((By.XPATH, "//div[@style='cursor: pointer;']")))
            triangle_icon.click()
            print(" User 1's inbox opened")

            print("5. Sending message from User 1...")
            message_text = "Hello Alicey!"
            message_input = webdriverwait1.until(EC.presence_of_element_located((By.CLASS_NAME, "message-input")))
            message_input.send_keys(message_text)
            send_button = driver1.find_element(By.CLASS_NAME, "send-btn")
            send_button.click()
            print(" Message sent")

            print("6. Opening User 2's inbox...")
            triangle_icon_user2 = webdriverwait2.until(
                EC.presence_of_element_located((By.XPATH, "//div[@style='cursor: pointer;']")))
            triangle_icon_user2.click()
            print(" User 2's inbox opened")

            print("7. Verifying message receipt...")
            message_id = UserAccountTest.get_message_id("bobby", message_text)
            received_message = webdriverwait2.until(
                EC.presence_of_element_located((By.ID, message_id)))
            self.assertTrue(received_message.is_displayed())
            print(" Message receipt verified")

            print("8. Sending reply from User 2...")
            time.sleep(3)
            reply_text = "Hello Bobby!"
            reply_input = webdriverwait2.until(EC.presence_of_element_located((By.CLASS_NAME, "message-input")))
            reply_input.send_keys(reply_text)
            reply_button = driver2.find_element(By.CLASS_NAME, "send-btn")
            reply_button.click()
            print(" Reply sent")

            print("9. Verifying reply receipt...")
            reply_message_id = UserAccountTest.get_message_id("alicey", reply_text)
            received_reply = webdriverwait1.until(
                EC.presence_of_element_located((By.ID, reply_message_id)))
            self.assertTrue(received_reply.is_displayed())
            print(" Reply receipt verified")
            print("=== Message Send Test Completed Successfully ===\n")

        finally:
            print("Cleaning up test environment...")
            driver1.quit()
            driver2.quit()
            print(" Test environment cleaned up")

    def test_click_specific_color(self):
        print("\n=== Starting Color Selection Test ===")
        print("1. Loading application homepage...")
        self.driver.get(self.base_url)
        webdriverwait = WebDriverWait(self.driver, 10)

        print("2. Logging in user...")
        webdriverwait.until(EC.presence_of_element_located((By.ID, "login-username-input")))
        self.driver.find_element(By.ID,"login-username-input").send_keys(self.test_logusername)
        self.driver.find_element(By.ID,"login-password-input").send_keys(self.test_logpassword)
        self.driver.find_element(By.ID,"login-submit-button").click()
        print(" User logged in")
        
        print("3. Navigating to dashboard...")
        webdriverwait.until(EC.presence_of_element_located((By.ID, "dashboard-nav-button"))).click()
        print(" Dashboard loaded")
        
        print("4. Opening color settings...")
        edit_button = webdriverwait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "button[style*='background-color: blue']")))
        edit_button.click()
        print(" Color settings opened")
        
        print("5. Selecting new color...")
        color_div = webdriverwait.until(EC.presence_of_element_located(
            (By.XPATH, "//div[contains(@style, 'background: rgb(121, 133, 210)')]")))
        self.driver.execute_script("arguments[0].click();", color_div)
        self.actions.move_to_element(color_div).click().perform()
        print(" New color selected")
        
        print("6. Saving settings...")
        save_button = self.driver.find_element(By.CSS_SELECTOR, "button[style*='background-color: green']")
        save_button.click()
        print(" Settings saved")
        
        print("7. Verifying color change...")
        webdriverwait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
        time.sleep(1)
        
        garbage_collector = webdriverwait.until(EC.presence_of_element_located((By.ID, "garbage-collector")))
        rgba_color = garbage_collector.value_of_css_property("background-color")
        
        if (rgba_color.startswith("rgba")):
            rgba_values = rgba_color[5:-1].split(",")
            rgb_color = f"rgb({rgba_values[0].strip()}, {rgba_values[1].strip()}, {rgba_values[2].strip()})"
        else:
            rgb_color = rgba_color
        
        expected_color = "rgb(121, 133, 210)"
        self.assertEqual(rgb_color, expected_color, 
                        f"Color mismatch! Expected {expected_color}, but got {rgb_color}.")
        print(" Color change verified")
        print("=== Color Selection Test Completed Successfully ===\n")

    def test_settings_and_play_with_movement(self):
        print("\n=== Starting Movement Settings Test ===")
        print("1. Loading application homepage...")
        self.driver.get(self.base_url)
        webdriverwait = WebDriverWait(self.driver, 10)

        print("2. Logging in user...")
        webdriverwait.until(EC.presence_of_element_located((By.ID, "login-username-input")))
        self.driver.find_element(By.ID,"login-username-input").send_keys(self.test_logusername)
        self.driver.find_element(By.ID,"login-password-input").send_keys(self.test_logpassword)
        self.driver.find_element(By.ID,"login-submit-button").click()
        
        print(" User logged in")
        
        print("3. Navigating to settings...")
        webdriverwait.until(EC.presence_of_element_located((By.ID, "dashboard-nav-button"))).click()
        edit_button = self.wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "button[style*='background-color: blue']")))
        edit_button.click()
        print(" Settings opened")
        
        print("4. Setting movement keys...")
        move_left_input = self.driver.find_element(By.XPATH, "//li[contains(., 'Move Left')]/input")
        move_left_input.click()
        self.actions.send_keys("a").perform()

        move_right_input = self.driver.find_element(By.XPATH, "//li[contains(., 'Move Right')]/input")
        move_right_input.click()
        self.actions.send_keys("d").perform()
        print(" Movement keys set")
        
        print("5. Saving settings...")
        save_button = self.driver.find_element(By.CSS_SELECTOR, "button[style*='background-color: green']")
        save_button.click()
        print(" Settings saved")
        
        print("6. Testing movement in game...")
        webdriverwait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
        start_round_button = webdriverwait.until(EC.presence_of_element_located((By.ID, "start-round-button")))
        start_round_button.click()

        garbage = webdriverwait.until(EC.presence_of_element_located((By.ID, "garbage-collector")))

        initial_pos = garbage.get_attribute("style")

        self.actions.key_down("a").pause(1).key_up("a").perform()
        time.sleep(1)
        left_pos = garbage.get_attribute("style")
        self.assertNotEqual(initial_pos, left_pos, "Garbage collector did not move left")

        self.actions.key_down("d").pause(1).key_up("d").perform()
        time.sleep(1)
        right_pos = garbage.get_attribute("style") 
        self.assertNotEqual(left_pos, right_pos, "Garbage collector did not move right")

        print("Custom key movement tests passed.")
        print("=== Movement Settings Test Completed Successfully ===\n")

if __name__ == "__main__":
    unittest.main()
