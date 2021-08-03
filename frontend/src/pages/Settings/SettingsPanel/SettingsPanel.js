import React from 'react';
import './SettingsPanel.css'
import { SettingItem } from '../../../components/SettingItem/SettingItem';

//TODO: Implement redux for better state management to prevent ugly nested props. 
export function SettingsPanel(props){
    return (
        <div className={"settings-grid"}>
            {!props.settingsList ? null : (
                Object.keys(props.settingsList).map((settingKey, i) => {
                    const setting = props.settingsList[settingKey];
                    return (
                        <SettingItem 
                            settingId={settingKey}
                            name={setting.name}
                            description={setting.description}
                            type={setting.type}
                            default={setting.default}
                            category={setting.category}
                            currentVal={setting.value}
                            key={settingKey}
                            options={setting.options}
                            onSettingChange={props.onSettingChange}
                        />
                    )
                })
            )}
            
        </div>
        
        
    )
}