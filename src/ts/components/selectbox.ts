/*
 * Copyright (C) 2016, bitmovin GmbH, All Rights Reserved
 *
 * Authors: Mario Guggenberger <mario.guggenberger@bitmovin.com>
 *
 * This source code and its use and distribution, is subject to the terms
 * and conditions of the applicable license agreement.
 */

import {ListSelector, ListSelectorConfig} from "./listselector";
import {DOM} from "../dom";

/**
 * A simple select box providing the possibility to select a single item out of a list of available items.
 *
 * DOM example:
 * <code>
 *     <select class="ui-selectbox">
 *         <option value="key">label</option>
 *         ...
 *     </select>
 * </code>
 */
export class SelectBox extends ListSelector<ListSelectorConfig> {

    private selectElement: DOM;

    constructor(config: ListSelectorConfig = {}) {
        super(config);

        this.config = this.mergeConfig(config, {
            cssClass: 'ui-selectbox'
        }, this.config);
    }

    protected toDomElement(): DOM {
        let selectElement = new DOM('select', {
            'id': this.config.id,
            'class': this.getCssClasses()
        });

        this.selectElement = selectElement;
        this.updateDomItems();

        let self = this;
        selectElement.on('change', function () {
            let value = new DOM(this).val();
            self.onItemSelectedEvent(value, false);
        });

        return selectElement;
    }

    protected updateDomItems(selectedValue: string = null) {
        // Delete all children
        this.selectElement.empty();

        // Add updated children
        for (let value in this.items) {
            let label = this.items[value];
            let optionElement = new DOM('option', {
                'value': value
            }).html(label);

            if (value == selectedValue + "") { // convert selectedValue to string to catch "null"/null case
                optionElement.attr('selected', 'selected');
            }

            this.selectElement.append(optionElement);
        }
    }

    protected onItemAddedEvent(value: string) {
        super.onItemAddedEvent(value);
        this.updateDomItems(this.selectedItem);
    }

    protected onItemRemovedEvent(value: string) {
        super.onItemRemovedEvent(value);
        this.updateDomItems(this.selectedItem);
    }

    protected onItemSelectedEvent(value: string, updateDomItems: boolean = true) {
        super.onItemSelectedEvent(value);
        if (updateDomItems) {
            this.updateDomItems(value);
        }
    }
}