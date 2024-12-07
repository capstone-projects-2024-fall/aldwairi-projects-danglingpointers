from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

import time


def test_verify_garbage_collector_color():
    # Initialize WebDriver
    driver = webdriver.Chrome()
    wait = WebDriverWait(driver, 20)
    try:
        # Open the application
        driver.get("http://localhost:3000")
        
        # Login
        username_input = wait.until(EC.presence_of_element_located((By.ID, "login-username-input")))
        password_input = driver.find_element(By.ID, "login-password-input")
        login_button = driver.find_element(By.ID, "login-submit-button")
        
        username_input.send_keys("bobby")
        password_input.send_keys("password_bob")
        login_button.click()
        # Navigate to the play page
        wait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
        
        time.sleep(3)
        userin =driver.find_element(By.TAG_NAME, "body")
        userin.send_keys(Keys.TAB)
        userin.send_keys(Keys.TAB)
        # Start the game
        practice_button = wait.until(EC.presence_of_element_located((By.XPATH, "//button[text()='Begin Practice']")))
        practice_button.click()
        

        lives_element = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "lives-remaining")))
        hearts_before = lives_element.text.count("❤️")
        print(hearts_before)

        userin.send_keys(Keys.ENTER)
        
        time.sleep(2)
        
        hearts_after = lives_element.text.count("❤️")

        assert hearts_after == hearts_before + 1, f"Hearts did not increase as expected. Before: {hearts_before}, After: {hearts_after}"
        print("Test passed: Hearts increased as expected.")
    
    finally:
        driver.quit()

# Run the test
test_verify_garbage_collector_color()
