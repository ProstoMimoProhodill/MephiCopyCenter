import pyautogui
from time import time, sleep

# pyautogui.displayMousePosition()
sleep(10)

t = time()
pyautogui.moveTo(943, 729)
pyautogui.click()
pyautogui.moveTo(976, 717)
pyautogui.click()
print(time() - t)
