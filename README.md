# Tab Auto Refresh Extension

A Chrome browser extension that automatically refreshes the current active tab at user-defined intervals. Perfect for monitoring dashboards, live feeds, or any web content that requires regular updates.

## Features

- **Automatic Tab Refresh**: Refreshes the current active tab at customizable intervals
- **Flexible Timing**: Set refresh intervals from 1 second to 1 hour (3600 seconds)
- **Smart Tab Tracking**: Automatically tracks the active tab and stops when tab is closed
- **Window Focus Awareness**: Pauses refresh when browser window loses focus (optional behavior)
- **Persistent State**: Remembers settings and continues refreshing after browser restart
- **Clean UI**: Simple and intuitive popup interface
- **Privacy Focused**: Only requires minimal permissions for tab management

## Installation

### From Chrome Web Store

_Coming soon - extension will be published to Chrome Web Store_

### Manual Installation (Developer Mode)

1. Download or clone this repository:

   ```bash
   git clone https://github.com/ShahmeerAli1504/Tab-Refresher-Extension.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" by toggling the switch in the top right corner

4. Click "Load unpacked" and select the extension directory

5. The Tab Auto Refresh extension should now appear in your extensions list

## Usage

1. **Open the Extension**: Click on the Tab Auto Refresh icon in your Chrome toolbar

2. **Set Refresh Interval**: Enter the desired refresh interval in seconds (1-3600)

   - Minimum: 1 second
   - Maximum: 3600 seconds (1 hour)
   - Recommended: 30+ seconds for most use cases

3. **Start Auto Refresh**: Click the "Start Auto Refresh" button

   - The extension will begin refreshing the current active tab
   - The button will be disabled and show the current status

4. **Stop Auto Refresh**: Click the "Stop Auto Refresh" button to halt the automatic refreshing

### Example Use Cases

- **Monitoring Dashboards**: Keep analytics or monitoring dashboards up-to-date
- **Live Feeds**: Refresh news feeds, social media, or live blogs
- **Development**: Auto-refresh during web development to see changes
- **Stock Tracking**: Keep financial data current
- **System Monitoring**: Refresh server status pages or logs

## Technical Details

### Architecture

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Service Worker**: Background script handles refresh logic and alarms
- **Popup Interface**: HTML/CSS/JavaScript for user interaction
- **Chrome APIs Used**:
  - `activeTab`: Access to current active tab
  - `tabs`: Tab management and monitoring
  - `storage`: Persistent settings storage
  - `alarms`: Reliable timing for refresh intervals

### File Structure

```
Tab-Refresher-Extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (background logic)
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
└── README.md             # This file
```

### Key Features Implementation

- **Alarm-based Timing**: Uses Chrome's `alarms` API for reliable, battery-efficient timing
- **Tab State Management**: Monitors tab updates and removals to handle edge cases
- **Window Focus Detection**: Optionally pauses refresh when browser loses focus
- **Error Handling**: Graceful handling of tab closures and navigation changes
- **State Persistence**: Maintains refresh state across browser sessions

## Permissions Explained

The extension requests the following permissions:

- **`activeTab`**: Required to refresh the current active tab
- **`tabs`**: Needed to monitor tab state and handle tab changes
- **`storage`**: Used to save user preferences and maintain state
- **`alarms`**: Enables reliable timing for refresh intervals

_The extension only accesses the tab you're currently viewing and does not collect or transmit any personal data._

## Development

### Prerequisites

- Google Chrome browser
- Basic knowledge of JavaScript, HTML, and CSS
- Chrome Extensions development familiarity (optional)

### Local Development

1. Clone the repository
2. Make your changes to the source files
3. Load the extension in Chrome using Developer mode
4. Test your changes
5. Reload the extension in `chrome://extensions/` after making changes

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Extension not working after browser restart**

- The extension should automatically restore its state. If not, try disabling and re-enabling the extension.

**Refresh not working on certain websites**

- Some websites may prevent automatic refresh. This is normal behavior for security-sensitive sites.

**High CPU usage**

- Consider using longer refresh intervals (30+ seconds) to reduce resource usage.

**Extension icon not visible**

- Pin the extension to your toolbar by clicking the puzzle piece icon and pinning "Tab Auto Refresh".

### Debug Mode

To debug the extension:

1. Go to `chrome://extensions/`
2. Find "Tab Auto Refresh" and click "Details"
3. Click "Inspect views: service worker" to debug the background script
4. Right-click the extension icon and select "Inspect popup" to debug the popup

## Privacy Policy

This extension:

- Does not collect any personal information
- Does not transmit data to external servers
- Only accesses the current active tab for refresh functionality
- Stores preferences locally in your browser

## Changelog

### Version 1.0

- Initial release
- Basic auto-refresh functionality
- Configurable refresh intervals (1-3600 seconds)
- Tab state management
- Window focus awareness
- Persistent state across browser sessions

## Acknowledgments

- Built using Chrome Extensions Manifest V3
- Icons created using SVG for scalability and performance
- Inspired by the need for reliable tab refresh functionality in modern web browsers
