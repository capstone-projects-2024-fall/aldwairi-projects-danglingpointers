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
        self.login_user()
        webdriverwait = WebDriverWait(self.driver, 10)

        # Navigate to leaderboard first to get initial state 
        webdriverwait.until(EC.presence_of_element_located((By.ID, "leaderboard-nav-button"))).click()
        webdriverwait.until(EC.presence_of_element_located((By.ID, "solo-leaderboard")))
        solo_leaderboard = self.driver.find_element(By.ID, "solo-leaderboard")
        initial_game_scores = solo_leaderboard.find_elements(By.CLASS_NAME, "game-scores")
        
        # Initial count of game entries
        webdriverwait.until(EC.presence_of_element_located((By.ID, "solo-leaderboard")))
        solo_leaderboard = self.driver.find_element(By.ID, "solo-leaderboard")
        initial_entries = solo_leaderboard.find_elements(By.CLASS_NAME, "game-entry")
        initial_count = len(initial_entries)

        # Play game to generate new score
        webdriverwait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
        start_button = webdriverwait.until(EC.presence_of_element_located((By.ID, "start-round-button")))
        start_button.click()
        
        # Click game area to focus
        game_area = self.driver.find_element(By.CLASS_NAME, "game")
        actions = ActionChains(self.driver)
        actions.move_to_element(game_area).click().perform()

        # Try different pause durations to score points
        pause_times = [0.011, 0.012, 0.013, 0.014, 0.015]
        
        for pause_duration in pause_times:
            self.driver.refresh()
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
            while attempts < 17:
                actions.key_down(Keys.ARROW_LEFT).pause(pause_duration).key_up(Keys.ARROW_LEFT).perform()
                time.sleep(0.13)
                
                final_score = self.driver.find_element(By.ID, "game-score").text
                if final_score != initial_score:

                    actions.key_down(Keys.ARROW_RIGHT).pause(pause_duration).key_up(Keys.ARROW_RIGHT).perform()
                    actions.key_down(Keys.ARROW_RIGHT).pause(pause_duration).key_up(Keys.ARROW_RIGHT).perform()
                    time.sleep(15)


                    # Return to leaderboard to check update
                    webdriverwait.until(EC.presence_of_element_located((By.ID, "leaderboard-nav-button"))).click()
                    
                    # Get updated game scores specifically from solo leaderboard

                    webdriverwait.until(EC.presence_of_element_located((By.ID, "solo-leaderboard")))
                    solo_leaderboard = self.driver.find_element(By.ID, "solo-leaderboard")
                    webdriverwait.until(EC.presence_of_element_located((By.CLASS_NAME, "game-scores")))
                    updated_game_scores = solo_leaderboard.find_elements(By.CLASS_NAME, "game-scores")


                    # Check for additional game entry
                    webdriverwait.until(EC.presence_of_element_located((By.ID, "solo-leaderboard")))
                    solo_leaderboard = self.driver.find_element(By.ID, "solo-leaderboard")
                    updated_entries = solo_leaderboard.find_elements(By.CLASS_NAME, "game-entry")
                    self.assertGreater(
                        len(updated_entries),
                        initial_count,
                        "Should have additional game entry after completing game"
                    )
                    return
                    
                attempts += 1
                
        self.fail("Could not achieve score increase with any timing")

    def test_watch_realtime(self):
        # First browser setup - watching
        self.login_user()
        webdriverwait = WebDriverWait(self.driver, 10)
        
        # Navigate to watchlist
        
        webdriverwait.until(EC.presence_of_element_located((By.ID, "watch-nav-button"))).click()
        webdriverwait.until(EC.presence_of_element_located((By.ID, "solo-watchlist")))
        solo_watchlist = self.driver.find_element(By.ID, "solo-watchlist")
        initial_entries = solo_watchlist.find_elements(By.CLASS_NAME, "game-entry")
        initial_count = len(initial_entries)

        # Setup second browser
        driver2 = webdriver.Chrome()
        driver2.maximize_window()
        driver2.get(self.base_url)
        webdriverwait2 = WebDriverWait(driver2, 10)
        
        try:
            # Login as different user
            webdriverwait2.until(EC.presence_of_element_located((By.ID, "login-username-input")))
            driver2.find_element(By.ID, "login-username-input").send_keys("alicey")
            driver2.find_element(By.ID, "login-password-input").send_keys("password_alicey")
            driver2.find_element(By.ID, "login-submit-button").click()
            webdriverwait2.until(EC.presence_of_element_located((By.ID, "inbox-component")))
            
            # Start game in second browser
            webdriverwait2.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
            start_button = webdriverwait2.until(EC.presence_of_element_located((By.ID, "start-round-button")))
            start_button.click()
            
            # First browser should see update immediately
            webdriverwait.until(EC.presence_of_element_located((By.ID, "solo-watchlist")))
            solo_watchlist = self.driver.find_element(By.ID, "solo-watchlist")
            updated_entries = solo_watchlist.find_elements(By.CLASS_NAME, "game-entry")
            
            self.assertGreater(
                len(updated_entries),
                initial_count,
                "Watchlist should update in real-time when another player starts a game"
            )
        
        finally:
            driver2.quit()

if __name__ == "__main__":
    unittest.main()