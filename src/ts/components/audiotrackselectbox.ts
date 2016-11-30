/*
 * Copyright (C) 2016, bitmovin GmbH, All Rights Reserved
 *
 * Authors: Mario Guggenberger <mario.guggenberger@bitmovin.com>
 *
 * This source code and its use and distribution, is subject to the terms
 * and conditions of the applicable license agreement.
 */

import {SelectBox} from "./selectbox";
import {ListSelectorConfig} from "./listselector";
import {UIManager} from "../uimanager";

/**
 * A select box providing a selection between available audio tracks (e.g. different languages).
 */
export class AudioTrackSelectBox extends SelectBox {

    constructor(config: ListSelectorConfig = {}) {
        super(config);
    }

    configure(player: bitmovin.player.Player, uimanager: UIManager): void {
        let self = this;

        let updateAudioTracks = function () {
            let audioTracks = player.getAvailableAudio();

            self.clearItems();

            // Add audio tracks
            for (let audioTrack of audioTracks) {
                self.addItem(audioTrack.id, audioTrack.label);
            }
        };

        self.onItemSelected.subscribe(function (sender: AudioTrackSelectBox, value: string) {
            player.setAudio(value);
        });

        let audioTrackHandler = function () {
            let currentAudioTrack = player.getAudio();
            self.selectItem(currentAudioTrack.id);
        };

        player.addEventHandler(bitmovin.player.EVENT.ON_AUDIO_CHANGE, audioTrackHandler); // Update selection when selected track has changed
        player.addEventHandler(bitmovin.player.EVENT.ON_SOURCE_UNLOADED, updateAudioTracks); // Update tracks when source goes away
        player.addEventHandler(bitmovin.player.EVENT.ON_READY, updateAudioTracks); // Update tracks when a new source is loaded

        // Populate tracks at startup
        updateAudioTracks();
    }
}