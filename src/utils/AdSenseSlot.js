import React from "react";
import AdSense from "react-adsense";
import {GOOGLE_AD_SENSE_ID} from "../constants";

export class AdSenseSlot {

    static renderSlot0 = () => (
        <AdSense.Google client={GOOGLE_AD_SENSE_ID} format="fluid" layoutKey="-fb+5w+4e-db+86"
                        responsive='true' slot="1111111111"/>
    );

    static renderSlot1 = () => (
        <div className="content divided">
            <AdSense.Google client={GOOGLE_AD_SENSE_ID} format="fluid" layoutKey="-fb+5w+4e-db+86"
                            responsive='true' slot="1111111111"/>
        </div>
    );

    static renderSlot2 = () => (
        <AdSense.Google client={GOOGLE_AD_SENSE_ID} format="fluid" layoutKey="+2t+rl+2h-1m-4u"
                        responsive='true' slot="1111111111"/>
    );
}




