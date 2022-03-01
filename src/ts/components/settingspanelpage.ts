import {Container, ContainerConfig} from './container';
import {SettingsPanelItem} from './settingspanelitem';
import {UIInstanceManager} from '../uimanager';
import {Event, EventDispatcher, NoArgs} from '../eventdispatcher';
import { PlayerAPI } from 'bitmovin-player';
import { BrowserUtils } from '../browserutils';

export interface SettingsPanelPageConfig extends ContainerConfig {
  autoFocusOn?: 'activeItems' | 'label';
}

/**
 * A panel containing a list of {@link SettingsPanelItem items} that represent labelled settings.
 */
export class SettingsPanelPage extends Container<SettingsPanelPageConfig> {

  private static readonly CLASS_LAST = 'last';
  private static readonly CLASS_FOCUS_ON_LABEL = 'focus-on-label';

  private settingsPanelPageEvents = {
    onSettingsStateChanged: new EventDispatcher<SettingsPanelPage, NoArgs>(),
    onActive: new EventDispatcher<SettingsPanelPage, NoArgs>(),
    onInactive: new EventDispatcher<SettingsPanelPage, NoArgs>(),
  };

  constructor(config: SettingsPanelPageConfig) {
    super(config);

    this.config = this.mergeConfig<SettingsPanelPageConfig>(config, {
      cssClass: 'ui-settings-panel-page',
      role: 'menu',
      autoFocusOn: 'activeItems',
    }, this.config);

    if (this.getConfig().autoFocusOn === 'label') {
      this.config.cssClass += ` ${this.prefixCss(SettingsPanelPage.CLASS_FOCUS_ON_LABEL)}`;
    }
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    // Fire event when the state of a settings-item has changed
    let settingsStateChangedHandler = () => {
      this.onSettingsStateChangedEvent();

      // Attach marker class to last visible item
      let lastShownItem = null;
      for (let component of this.getItems()) {
        component.getDomElement().removeClass(this.prefixCss(SettingsPanelPage.CLASS_LAST));
        if (component.isShown()) {
          lastShownItem = component;
        }
      }
      if (lastShownItem) {
        lastShownItem.getDomElement().addClass(this.prefixCss(SettingsPanelPage.CLASS_LAST));
      }
    };
    for (let component of this.getItems()) {
      component.onActiveChanged.subscribe(settingsStateChangedHandler);
    }
  }

  hasActiveSettings(): boolean {
    for (let component of this.getItems()) {
      if (component.isActive()) {
        return true;
      }
    }

    return false;
  }

  getItems(): SettingsPanelItem[] {
    return <SettingsPanelItem[]>this.config.components.filter(component => component instanceof SettingsPanelItem);
  }

  onSettingsStateChangedEvent() {
    this.settingsPanelPageEvents.onSettingsStateChanged.dispatch(this);
  }

  get onSettingsStateChanged(): Event<SettingsPanelPage, NoArgs> {
    return this.settingsPanelPageEvents.onSettingsStateChanged.getEvent();
  }

  onActiveEvent() {
    this.settingsPanelPageEvents.onActive.dispatch(this);

    switch (this.getConfig().autoFocusOn) {
      case 'label': {
        const pageElement = this.getDomElement();
        const pageLabels = pageElement.find('label');

        for (const label of pageLabels.get()) {
          const labelIsVisible = label.offsetWidth > 0 && label.offsetHeight > 0;
          if (labelIsVisible) {
            label.focus();
            break;
          }
        }
        break;
      }

      case 'activeItems':
      default: {
        const activeItems = this.getItems().filter((item) => item.isActive());
        // Disable focus for iOS and iPadOS 13. They open select boxes automatically on focus and we want to avoid that.
        if (activeItems.length > 0 && !BrowserUtils.isIOS && !(BrowserUtils.isMacIntel && BrowserUtils.isTouchSupported)) {
          activeItems[0].getDomElement().focusToFirstInput();
        }
        break;
      }
    }
  }

  get onActive(): Event<SettingsPanelPage, NoArgs> {
    return this.settingsPanelPageEvents.onActive.getEvent();
  }

  onInactiveEvent() {
    this.settingsPanelPageEvents.onInactive.dispatch(this);
  }

  get onInactive(): Event<SettingsPanelPage, NoArgs> {
    return this.settingsPanelPageEvents.onInactive.getEvent();
  }
}
