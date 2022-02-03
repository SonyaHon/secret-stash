import { makeAutoObservable } from "mobx";

// Settings
const DRAWER_MAX_WIDTH = 350;
const DRAWER_MIN_WIDTH = 260;

export class UiStore {
  drawerOpened = false;

  drawerWidth = UiStore.calcDrawerWidth();

  constructor() {
    makeAutoObservable(this);

    window.addEventListener("resize", () => {
      this.drawerWidth = UiStore.calcDrawerWidth();
    });
  }

  toggleDrawer() {
    this.drawerOpened = !this.drawerOpened;
  }

  private static calcDrawerWidth(): number {
    const percents = Math.floor(window.innerWidth * 0.2); // 20% of screen width
    return Math.min(Math.max(DRAWER_MIN_WIDTH, percents), DRAWER_MAX_WIDTH);
  }
}
