# DBAI OPKG Repository
Custom Repository for OpenWRT

## How to Contribute
1. Fork this GitHub Repository
2. Add your own Package Source on ` feeds ` Folder
3. Edit ` list_packages.txt ` files, add your Package name **split by space**
4. Edit ` README.md ` files, add your Package name & description
5. Pull request

## How To Use
### On Running OpenWRT Firmware
1. Edit ` /etc/opkg.conf ` files, add ` # ` on front from ` option check_signature `
   - Before ` option check_signature `
   - After ` #option check_signature `
2. Edit ` /etc/opkg/customfeeds.conf ` and Add DBAI OPKG Repo. ex:
   ```bash
     src/gz dbai-act https://repo.dbai.team/releases/22.03/packages/aarch64_generic/action
     src/gz dbai-base https://repo.dbai.team/releases/22.03/packages/aarch64_generic/base
     src/gz dbai-pkg https://repo.dbai.team/releases/22.03/packages/aarch64_generic/packages
     src/gz dbai-luci https://repo.dbai.team/releases/22.03/packages/aarch64_generic/luci
     ```
   - Format : ` src/gz dbai-pkg https://repo.dbai.team/releases/{OPENWRT_VERSION}/packages/{ARCH}/packages `
   - Supported OpenWRT Version : ` 21.xx 22.xx 23.xx `
   - Architecture Supported :
     ```
     x86_64
     mips_24kc
     mipsel_24kc
     arm_cortex-a7_neon-vfpv4
     aarch64_cortex-a53
     aarch64_cortex-a72
     aarch64_generic 
     ```
3. Run ` opkg update ` at ` Terminal ` or ` Update List ` at LUCI Dashboard ` System > Software `
   
## Package List
| Packages | Description |
| ---- | ---- |
| [luci-app-cloudflared][] | Connection your OpenWrt with Cloudflared Zero Trust Tunnel via LuCI |
| [luci-theme-alpha][] | Luci theme for Official Openwrt and Alpha OS build ,based on bootstrap and material luCi theme refferences |


[luci-app-cloudflared]: https://github.com/animegasan/luci-app-cloudflared
[luci-theme-alpha]: https://github.com/derisamedia/luci-theme-alpha
 
