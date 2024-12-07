from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time

def test_click_specific_color():
    driver = webdriver.Chrome()
    wait = WebDriverWait(driver, 20)
    
    try:
        driver.get("http://localhost:3000")
        
        username_input = wait.until(EC.presence_of_element_located((By.ID, "login-username-input")))
        password_input = driver.find_element(By.ID, "login-password-input")
        login_button = driver.find_element(By.ID, "login-submit-button")
        
        username_input.send_keys("bobby")
        password_input.send_keys("password_bob")
        login_button.click()
        
        # Navigate to the dashboard
        wait.until(EC.presence_of_element_located((By.ID, "dashboard-nav-button"))).click()
        
        edit_button = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "button[style*='background-color: blue']")))
        edit_button.click()
        
        # Wait for and locate the color div
        color_div = wait.until(EC.presence_of_element_located(
            (By.XPATH, "//div[contains(@style, 'background: rgb(121, 133, 210)')]")
        ))
        
        driver.execute_script("arguments[0].click();", color_div)
        actions = ActionChains(driver)
        actions.move_to_element(color_div).click().perform()
        
        # Save the settings
        save_button = driver.find_element(By.CSS_SELECTOR, "button[style*='background-color: green']")
        save_button.click()
        
        # Navigate to the play page
        wait.until(EC.presence_of_element_located((By.ID, "play-nav-button"))).click()
        time.sleep(1)
        
        
        # Wait for the garbage collector to load and retrieve its background color
        garbage_collector = wait.until(EC.presence_of_element_located((By.ID, "garbage-collector")))
        rgba_color = garbage_collector.value_of_css_property("background-color")
        print(f"RGBA color retrieved: {rgba_color}")
        
        # Convert rgba to rgb
        if rgba_color.startswith("rgba"):
            rgba_values = rgba_color[5:-1].split(",")
            rgb_color = f"rgb({rgba_values[0].strip()}, {rgba_values[1].strip()}, {rgba_values[2].strip()})"
        else:
            rgb_color = rgba_color
        
        
        expected_color = "rgb(121, 133, 210)"
        assert rgb_color == expected_color, f"Color mismatch! Expected {expected_color}, but got {rgb_color}."
        
        print("Color change verification passed.")
    
    finally:
        driver.quit()

# Run the test
test_click_specific_color()
