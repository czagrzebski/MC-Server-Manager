import React from 'react';
import './SettingsPanel.css'
import { SettingItem } from '../../../components/SettingItem/SettingItem';

//TODO: Implement redux for better state management to prevent ugly nested props. 
export function SettingsPanel(props){
    return (
        <div className={"settings-grid"}>
            {!props.settingsList ? null : (
                Object.keys(props.settingsList).map((settingKey, i) => {
                    return (
                        <SettingItem 
                            settingId={settingKey}
                            setting={props.settingsList[settingKey]}
                            key={i}
                            onSettingChange={props.onSettingChange}
                        />
                    )
                })
            )}
            
        </div>
    )
}