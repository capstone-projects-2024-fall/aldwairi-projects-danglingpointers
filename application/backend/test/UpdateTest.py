import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

class UpdateTest(unittest.TestCase):

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
        """Helper method to login before testing update features"""
        self.driver.get(self.base_url)
        webdriverwait = WebDriverWait(self.driver, 10)
        
        webdriverwait.until(
            EC.presence_of_element_located((By.ID, "login-username-input"))
        )
        
        self.driver.find_element(By.ID, "login-username-input").send_keys(self.test_username)
        self.driver.find_element(By.ID, "login-password-input").send_keys(self.test_password)
        self.driver.find_element(By.ID, "login-submit-button").click()
        webdriverwait.until(EC.presence_of_element_located((By.ID, "inbox-component")))

    def test_leaderboard_update(self):
        print("\n=== Starting Leaderboard Update Test ===")
        print("1. Logging in user...")
        self.login_user()
        webdriverwait = WebDriverWait(self.driver, 10)
        print("User logged in")

        print("2. Getting initial leaderboard state...")
        webdriverwait.until(EC.presence_of_element_located((By.ID, "leaderboard-nav-button"))).click()
        webdriverwait.until(EC.presence_of_element_located((By.ID, "solo-leaderboard")))
        solo_leaderboard = self.driver.find_element(By.ID, "solo-leaderboard")
        initial_game_scores = solo_leaderboard.find_elements(By.CLASS_NAME, "game-scores")
        initial_entries = solo_leaderboard.find_elements(By.CLASS_NAME, "game-entry")
        initial_count = len(initial_entries)
        print(f"Initial entries count: {initial_count}")

        print("3. Starting game session...")
        webdriverwait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
        start_button = webdriverwait.until(EC.presence_of_element_located((By.ID, "start-round-button")))
        start_button.click()
        print("Game session started")

        print("4. Setting up game focus...")
        game_area = self.driver.find_element(By.CLASS_NAME, "game")
        actions = ActionChains(self.driver)
        actions.move_to_element(game_area).click().perform()
        print("Game focus set")

        print("5. Testing score increase with different timings...")
        pause_times = [0.011, 0.012, 0.013, 0.014, 0.015]
        
        for pause_duration in pause_times:
            print(f"\n   Testing pause duration: {pause_duration}")
            self.driver.refresh()
            webdriverwait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
            start_button = webdriverwait.until(EC.presence_of_element_located((By.ID, "start-round-button")))
            start_button.click()

            print("   Setting up game elements...")
            stack = webdriverwait.until(EC.presence_of_element_located((By.CLASS_NAME, "stack")))
            garbage = webdriverwait.until(EC.presence_of_element_located((By.ID, "garbage-collector")))
            game_area = self.driver.find_element(By.CLASS_NAME, "game")
            actions = ActionChains(self.driver)
            actions.move_to_element(game_area).click().perform()
            print(" Game elements ready")

            print("   Waiting for pointer...")
            pointer = webdriverwait.until(EC.presence_of_element_located((By.CLASS_NAME, "pointer")))
            initial_score = (self.driver.find_element(By.ID, "game-score").text)
            print(f" Initial score: {initial_score}")
            
            attempts = 0
            print("   Attempting to increase score...")
            while attempts < 17:
                actions.key_down(Keys.ARROW_LEFT).pause(pause_duration).key_up(Keys.ARROW_LEFT).perform()
                time.sleep(0.13)
                
                final_score = self.driver.find_element(By.ID, "game-score").text
                if final_score != initial_score:
                    print(f"   Score increased to {final_score}")

                    print("6. Moving garbage collector right...")
                    actions.key_down(Keys.ARROW_RIGHT).pause(pause_duration).key_up(Keys.ARROW_RIGHT).perform()
                    actions.key_down(Keys.ARROW_RIGHT).pause(pause_duration).key_up(Keys.ARROW_RIGHT).perform()
                    time.sleep(15)
                    print(" Movement complete")

                    print("7. Checking leaderboard update...")
                    webdriverwait.until(EC.presence_of_element_located((By.ID, "leaderboard-nav-button"))).click()
                    webdriverwait.until(EC.presence_of_element_located((By.ID, "solo-leaderboard")))
                    solo_leaderboard = self.driver.find_element(By.ID, "solo-leaderboard")
                    updated_entries = solo_leaderboard.find_elements(By.CLASS_NAME, "game-entry")
                    
                    self.assertGreater(
                        len(updated_entries),
                        initial_count,
                        "Should have additional game entry after completing game"
                    )
                    print(" Leaderboard update verified")
                    print("=== Leaderboard Update Test Completed Successfully ===\n")
                    return
                    
                attempts += 1
                print(f"   Attempt {attempts}: Score remains {final_score}")
                
        self.fail("Could not achieve score increase with any timing")
        print("=== Leaderboard Update Test Failed ===\n")

    def test_watch_realtime(self):
        print("\n=== Starting Real-time Watch Test ===")
        print("1. Setting up first browser...")
        self.login_user()
        webdriverwait = WebDriverWait(self.driver, 10)
        print(" First browser ready")
        
        print("2. Getting initial watchlist state...")
        webdriverwait.until(EC.presence_of_element_located((By.ID, "watch-nav-button"))).click()
        webdriverwait.until(EC.presence_of_element_located((By.ID, "solo-watchlist")))
        solo_watchlist = self.driver.find_element(By.ID, "solo-watchlist")
        initial_entries = solo_watchlist.find_elements(By.CLASS_NAME, "game-entry")
        initial_count = len(initial_entries)
        print(f" Initial watchlist entries: {initial_count}")

        print("3. Setting up second browser...")
        driver2 = webdriver.Chrome()
        driver2.maximize_window()
        driver2.get(self.base_url)
        webdriverwait2 = WebDriverWait(driver2, 10)
        print(" Second browser ready")
        
        try:
            print("4. Logging in second user...")
            webdriverwait2.until(EC.presence_of_element_located((By.ID, "login-username-input")))
            driver2.find_element(By.ID, "login-username-input").send_keys("alicey")
            driver2.find_element(By.ID, "login-password-input").send_keys("password_alicey")
            driver2.find_element(By.ID, "login-submit-button").click()
            webdriverwait2.until(EC.presence_of_element_located((By.ID, "inbox-component")))
            print(" Second user logged in")
            
            print("5. Starting game in second browser...")
            webdriverwait2.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
            start_button = webdriverwait2.until(EC.presence_of_element_located((By.ID, "start-round-button")))
            start_button.click()
            print(" Game started in second browser")
            
            print("6. Verifying watchlist update...")
            webdriverwait.until(EC.presence_of_element_located((By.ID, "solo-watchlist")))
            solo_watchlist = self.driver.find_element(By.ID, "solo-watchlist")
            updated_entries = solo_watchlist.find_elements(By.CLASS_NAME, "game-entry")
            
            self.assertGreater(
                len(updated_entries),
                initial_count,
                "Watchlist should update in real-time when another player starts a game"
            )
            print(" Real-time update verified")
            print("=== Real-time Watch Test Completed Successfully ===\n")
        
        finally:
            print("Cleaning up test environment...")
            driver2.quit()
            print(" Test environment cleaned up")

if __name__ == "__main__":
    unittest.main()