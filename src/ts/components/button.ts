/*
 * Copyright (C) 2016, bitmovin GmbH, All Rights Reserved
 *
 * Authors: Mario Guggenberger <mario.guggenberger@bitmovin.com>
 *
 * This source code and its use and distribution, is subject to the terms
 * and conditions of the applicable license agreement.
 */

import {ComponentConfig, Component} from "./component";
import {DOM} from "../dom";
import {EventDispatcher, NoArgs, Event} from "../eventdispatcher";

/**
 * Configuration interface for a {@link Button} component.
 */
export interface ButtonConfig extends ComponentConfig {
    /**
     * The text on the button.
     */
    text?: string;
}

/**
 * A simple clickable button.
 */
export class Button<Config extends ButtonConfig> extends Component<ButtonConfig> {

    private buttonEvents = {
        onClick: new EventDispatcher<Button<Config>, NoArgs>()
    };

    constructor(config: ButtonConfig) {
        super(config);

        this.config = this.mergeConfig(config, {
            cssClass: 'ui-button'
        }, this.config);
    }

    protected toDomElement(): DOM {
        let self = this;

        // Create the button element with the text label
        let buttonElement = new DOM('button', {
            'type': 'button',
            'id': this.config.id,
            'class': this.getCssClasses()
        }).append(new DOM('span', {
            'class': 'label'
        }).html(this.config.text));

        // Listen for the click event on the button element and trigger the corresponding event on the button component
        buttonElement.on('click', function () {
            self.onClickEvent();
        });

        return buttonElement;
    }

    protected onClickEvent() {
        this.buttonEvents.onClick.dispatch(this);
    }

    /**
     * Gets the event that is fired when the button is clicked.
     * @returns {Event<Sender, Args>}
     */
    get onClick(): Event<Button<Config>, NoArgs> {
        return this.buttonEvents.onClick.getEvent();
    }
}