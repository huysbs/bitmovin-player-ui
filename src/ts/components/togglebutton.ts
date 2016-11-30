/*
 * Copyright (C) 2016, bitmovin GmbH, All Rights Reserved
 *
 * Authors: Mario Guggenberger <mario.guggenberger@bitmovin.com>
 *
 * This source code and its use and distribution, is subject to the terms
 * and conditions of the applicable license agreement.
 */

import {Button, ButtonConfig} from "./button";
import {NoArgs, EventDispatcher, Event} from "../eventdispatcher";
import {DOM} from "../dom";

/**
 * Configuration interface for a toggle button component.
 */
export interface ToggleButtonConfig extends ButtonConfig {
    /**
     * The text on the button.
     */
    text?: string;
}

/**
 * A button that can be toggled between "on" and "off" states.
 */
export class ToggleButton<Config extends ToggleButtonConfig> extends Button<ToggleButtonConfig> {

    private static readonly CLASS_ON = "on";
    private static readonly CLASS_OFF = "off";

    private onState: boolean;

    private toggleButtonEvents = {
        onToggle: new EventDispatcher<ToggleButton<Config>, NoArgs>(),
        onToggleOn: new EventDispatcher<ToggleButton<Config>, NoArgs>(),
        onToggleOff: new EventDispatcher<ToggleButton<Config>, NoArgs>()
    };

    constructor(config: ToggleButtonConfig) {
        super(config);

        this.config = this.mergeConfig(config, {
            cssClass: 'ui-togglebutton'
        }, this.config);
    }

    /**
     * Toggles the button to the "on" state.
     */
    on() {
        if(this.isOff()) {
            this.onState = true;
            this.getDomElement().removeClass(ToggleButton.CLASS_OFF);
            this.getDomElement().addClass(ToggleButton.CLASS_ON);

            this.onToggleEvent();
            this.onToggleOnEvent();
        }
    }

    /**
     * Toggles the button to the "off" state.
     */
    off() {
        if(this.isOn()) {
            this.onState = false;
            this.getDomElement().removeClass(ToggleButton.CLASS_ON);
            this.getDomElement().addClass(ToggleButton.CLASS_OFF);

            this.onToggleEvent();
            this.onToggleOffEvent();
        }
    }

    /**
     * Toggle the button "on" if it is "off", or "off" if it is "on".
     */
    toggle() {
        if (this.isOn()) {
            this.off();
        } else {
            this.on();
        }
    }

    /**
     * Checks if the toggle button is in the "on" state.
     * @returns {boolean} true if button is "on", false if "off"
     */
    isOn(): boolean {
        return this.onState;
    }

    /**
     * Checks if the toggle button is in the "off" state.
     * @returns {boolean} true if button is "off", false if "on"
     */
    isOff(): boolean {
        return !this.isOn();
    }

    protected onClickEvent() {
        super.onClickEvent();

        // Fire the toggle event together with the click event
        // (they are technically the same, only the semantics are different)
        this.onToggleEvent();
    }

    protected onToggleEvent() {
        this.toggleButtonEvents.onToggle.dispatch(this);
    }

    protected onToggleOnEvent() {
        this.toggleButtonEvents.onToggleOn.dispatch(this);
    }

    protected onToggleOffEvent() {
        this.toggleButtonEvents.onToggleOff.dispatch(this);
    }

    /**
     * Gets the event that is fired when the button is toggled.
     * @returns {Event<Sender, Args>}
     */
    get onToggle(): Event<ToggleButton<Config>, NoArgs> {
        return this.toggleButtonEvents.onToggle.getEvent();
    }

    /**
     * Gets the event that is fired when the button is toggled "on".
     * @returns {Event<Sender, Args>}
     */
    get onToggleOn(): Event<ToggleButton<Config>, NoArgs> {
        return this.toggleButtonEvents.onToggleOn.getEvent();
    }

    /**
     * Gets the event that is fired when the button is toggled "off".
     * @returns {Event<Sender, Args>}
     */
    get onToggleOff(): Event<ToggleButton<Config>, NoArgs> {
        return this.toggleButtonEvents.onToggleOff.getEvent();
    }
}