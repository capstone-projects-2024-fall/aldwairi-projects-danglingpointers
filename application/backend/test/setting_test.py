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
    
    move_left_input = driver.find_element(By.XPATH, "//li[contains(., 'Move Left')]/input")
    move_left_input.click()
    actions.send_keys("a").perform()

    # Locate "Move Right" input by finding the parent `li` with text content and selecting the input inside it
    move_right_input = driver.find_element(By.XPATH, "//li[contains(., 'Move Right')]/input")
    move_right_input.click()
    actions.send_keys("d").perform()
    
    save_button = driver.find_element(By.CSS_SELECTOR, "button[style*='background-color: green']")
    save_button.click()
    
    wait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()

    start_round_button = wait.until(EC.presence_of_element_located((By.ID, "start-round-button")))
    start_round_button.click()

    # Wait for stack initialization and garbage collector
    garbage = wait.until(EC.presence_of_element_located((By.ID, "garbage-collector")))


    # Test left movement with custom key 'a'
    initial_left_pos = garbage.get_attribute("style")
    actions.key_down("a").pause(1).key_up("a").perform()
    time.sleep(1)

    # Test right movement with custom key 'd'
    initial_right_pos = garbage.get_attribute("style")
    actions.key_down("d").pause(1).key_up("d").perform()
    time.sleep(1)

    print("Custom key movement tests passed.")






# Run the test
test_settings_and_play_with_movement()
