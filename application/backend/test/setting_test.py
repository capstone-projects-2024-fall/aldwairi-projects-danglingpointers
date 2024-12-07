from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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
    move_left_input.click()  # Click to focus the input box
    actions.send_keys("a").perform()  # Send 'a' key to the input box
    print("Changed Move Left to 'a'.")
    
    move_right_input = driver.find_element(By.CSS_SELECTOR, "input[value='ArrowRight']")
    move_right_input.click()  # Click to focus the input box
    actions.send_keys("d").perform()  # Send 'd' key to the input box
    print("Changed Move Right to 'd'.")
    
    save_button = driver.find_element(By.CSS_SELECTOR, "button[style*='background-color: green']")
    save_button.click()
    print("Settings saved.")

    wait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()



    # Simulate pressing the new movement keys ('a' and 'd')
    actions.send_keys("a").perform()  # Simulate move left
    print("Pressed 'a' to move left.")
    
    actions.send_keys("d").perform()  # Simulate move right
    print("Pressed 'd' to move right.")


# Run the test
test_settings_and_play_with_movement()
