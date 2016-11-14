import {Container, ContainerConfig} from "./container";
import {Label, LabelConfig} from "./label";
import {Component, ComponentConfig} from "./component";
declare var require: any;

export interface SeekBarLabelConfig extends ContainerConfig {

}

export class SeekBarLabel extends Container<SeekBarLabelConfig> {

    private numeral = require('numeral');

    private label: Label<LabelConfig>;
    private thumbnail: Component<ComponentConfig>;

    constructor(config: SeekBarLabelConfig = {}) {
        super(config);

        this.label = new Label({cssClasses: ['label']});
        this.thumbnail = new Component({cssClasses: ['thumbnail']});

        this.config = this.mergeConfig(config, {
            cssClass: 'ui-seekbar-label',
            components: [this.thumbnail, this.label],
            hidden: true
        }, this.config);

        if(this.config.hidden) { // TODO fix this hack! Hiding should be done at a central place for all elements
            this.hide();
        }
    }

    setText(text: string) {
        this.label.setText(text);
    }

    setTime(seconds: number) {
        this.setText(this.numeral(seconds).format('00:00:00'));
    }

    setThumbnail(thumbnail: any = null) {
        let thumbnailElement = this.thumbnail.getDomElement();

        if (thumbnail == null) {
            thumbnailElement.css({
                "background-image": "none",
                "display": "none"
            });
        }
        else {
            thumbnailElement.css({
                "display": "inherit",
                "background-image": `url(${thumbnail.url})`,
                "width": thumbnail.w + "px",
                "height": thumbnail.h + "px",
                "background-position": `${thumbnail.x}px ${thumbnail.y}px`
            });
        }
    }
}