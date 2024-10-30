=== kidona-exif ===
Contributors: dfadel
Donate link: https://kidona.com/kidona-exif
Tags: EXIF, meta data
Requires at least: 4.7
Tested up to: 5.4
Stable tag: 4.3
Requires PHP: 7.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A plugin to add "View EXIF" links to the row actions of the Wordpress Media Library and NextGEN Manage Gallery list of images. The link triggers an accordion-style popup with complete EXIF data for the image.

== Description ==

A plugin to add "View EXIF" links to the row actions of the Wordpress Media Library and NextGEN Manage Gallery list of images. The link triggers an accordion-style popup with complete EXIF data for the image.

== Frequently Asked Questions ==

= How does the plugin work? =

The plugin works on the admin pages Media Library and NextGEN Manage Gallery (when you click on a particular Gallery), if you have NextGEN installed.

= What does the plugin do? =

The plugin displays complete EXIF information for the selected image.

= Where does the plugin obtain EXIF information? =

Short answer is from the image itself.

For Media Library images, it obtains it from the upload source directory.

For NextGEN images, NextGEN has its own directory where it places images. The plugin obtains EXIF data fromvthose images.

= What about IPTC data? =

Most if not all of what can be obtained via IPTC is included with this EXIF data. A design decision was to therefore exclude a specific IPTC link.

== Screenshots ==

1. Where the link appears in the Media Library
2. Where the link appears in NextGEN Manage Galleries
3. The accordion-style popup with EXIF information, organized by section

== Changelog ==

= 1.0 =
* Initial Release

== Upgrade Notice ==
= 1.0 =
Initial Release

