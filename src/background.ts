chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case 'toggle-dark-mode':
        chrome.storage.local.get('darkMode', (result) => {
          const newMode = !result.darkMode
          chrome.storage.local.set({ darkMode: newMode })
          chrome.runtime.sendMessage({ 
            action: 'darkModeChange', 
            value: newMode 
          })
        })
        break
  
      case 'toggle-clock-style':
        chrome.storage.local.get('clockStyle', (result) => {
          const newStyle = result.clockStyle === 'analog' ? 'digital' : 'analog'
          chrome.storage.local.set({ clockStyle: newStyle })
          chrome.runtime.sendMessage({ 
            action: 'clockStyleChange', 
            value: newStyle 
          })
        })
        break
  
      case 'focusSearch':
        chrome.tabs.sendMessage(sender.tab!.id!, { action: 'focusSearch' })
        break
    }
  })