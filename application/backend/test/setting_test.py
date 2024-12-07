from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_settings_and_play_with_movement():
    driver = webdriver.Chrome()
    wait = WebDriverWait(driver, 10)
    actions = ActionChains(driver)
    
    driver.get("http://localhost:3000")
    
    username_input = wait.until(EC.presence_of_element_located((By.ID, "login-username-input")))
    password_input = driver.find_element(By.ID, "login-password-input")
    login_button = driver.find_element(By.ID, "login-submit-button")
    
    username_input.send_keys("bobby")
    password_input.send_keys("password_bob")
    login_button.click()
    
    wait.until(EC.presence_of_element_located((By.ID, "dashboard-nav-button"))).click()
    edit_button = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "button[style*='background-color: blue']")))
    edit_button.click()
    
    move_left_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[value='ArrowLeft']")))
    move_left_input.click()
    actions.send_keys("a").perform()
    
    move_right_input = driver.find_element(By.CSS_SELECTOR, "input[value='ArrowRight']")
    move_right_input.click()
    actions.send_keys("d").perform()
    
    save_button = driver.find_element(By.CSS_SELECTOR, "button[style*='background-color: green']")
    save_button.click()
    
    wait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()

    start_round_button = wait.until(EC.presence_of_element_located((By.ID, "start-round-button")))
    start_round_button.click()
    print("Game started by pressing 'Start New Round'.")


    print("Testing continuous left movement...")
    start_time = time.time()
    while time.time() - start_time < 2:  # Move left for 2 seconds
        actions.send_keys("a").perform()
        time.sleep(0.01)  # Small delay to simulate real user input
    print("Left movement completed.")

    # Move Right Continuously
    print("Testing continuous right movement...")
    start_time = time.time()
    while time.time() - start_time < 2:  # Move right for 2 seconds
        actions.send_keys("d").perform()
        time.sleep(0.01)  # Small delay to simulate real user input
    print("Right movement completed.")


# Run the test
test_settings_and_play_with_movement()
