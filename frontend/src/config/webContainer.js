import { WebContainer } from '@webcontainer/api';

let WebContainerInstance = null;

export const getWebContainer = async () => {
    if (!WebContainerInstance) {
    WebContainerInstance = await WebContainer.boot();
    console.log("WebContainer booted");
  }
  return WebContainerInstance;
}