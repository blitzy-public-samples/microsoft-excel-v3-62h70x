import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Button } from 'src/frontend/components/common/Button';
import { Input } from 'src/frontend/components/common/Input';
import { Dropdown } from 'src/frontend/components/common/Dropdown';
import { Toggle } from 'src/frontend/components/common/Toggle';
import { useUserContext, useSettingsContext } from 'src/shared/contexts/index';
import { UserSettings } from 'src/shared/types/index';

export const Settings: React.FC = () => {
  const [formState, setFormState] = useState<UserSettings>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { user } = useUserContext();
  const { settings, updateSettings, resetSettings } = useSettingsContext();

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  const handleInputChange = (key: keyof UserSettings, value: any) => {
    setFormState(prevState => ({ ...prevState, [key]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings(formState);
      setMessage({ type: 'success', text: 'Settings saved successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    }
  };

  const handleResetSettings = async () => {
    try {
      await resetSettings();
      setFormState(settings);
      setMessage({ type: 'success', text: 'Settings reset to defaults' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset settings' });
    }
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>Settings</h1>
        <div className="settings-actions">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
          <Button onClick={handleResetSettings} variant="secondary">Reset to Defaults</Button>
        </div>
      </header>

      {message && (
        <div className={classNames('message', message.type)}>
          {message.text}
        </div>
      )}

      <form className="settings-form">
        <section className="settings-section">
          <h2>General Settings</h2>
          <Dropdown
            label="Language"
            options={['English', 'Spanish', 'French', 'German']}
            value={formState.language}
            onChange={(value) => handleInputChange('language', value)}
          />
          <Dropdown
            label="Theme"
            options={['Light', 'Dark', 'System']}
            value={formState.theme}
            onChange={(value) => handleInputChange('theme', value)}
          />
        </section>

        <section className="settings-section">
          <h2>Calculation Settings</h2>
          <Toggle
            label="Automatic Calculation"
            checked={formState.automaticCalculation}
            onChange={(value) => handleInputChange('automaticCalculation', value)}
          />
          <Toggle
            label="Iterative Calculation"
            checked={formState.iterativeCalculation}
            onChange={(value) => handleInputChange('iterativeCalculation', value)}
          />
        </section>

        <section className="settings-section">
          <h2>Editing Settings</h2>
          <Toggle
            label="Autocomplete"
            checked={formState.autocomplete}
            onChange={(value) => handleInputChange('autocomplete', value)}
          />
          <Toggle
            label="Drag and Drop"
            checked={formState.dragAndDrop}
            onChange={(value) => handleInputChange('dragAndDrop', value)}
          />
        </section>

        <section className="settings-section">
          <h2>View Settings</h2>
          <Toggle
            label="Show Formula Bar"
            checked={formState.showFormulaBar}
            onChange={(value) => handleInputChange('showFormulaBar', value)}
          />
          <Toggle
            label="Show Gridlines"
            checked={formState.showGridlines}
            onChange={(value) => handleInputChange('showGridlines', value)}
          />
          <Toggle
            label="Show Headers"
            checked={formState.showHeaders}
            onChange={(value) => handleInputChange('showHeaders', value)}
          />
        </section>

        <section className="settings-section">
          <h2>Proofing Settings</h2>
          <Toggle
            label="Spell Check"
            checked={formState.spellCheck}
            onChange={(value) => handleInputChange('spellCheck', value)}
          />
          <Toggle
            label="Autocorrect"
            checked={formState.autocorrect}
            onChange={(value) => handleInputChange('autocorrect', value)}
          />
        </section>

        <section className="settings-section">
          <h2>Save Settings</h2>
          <Input
            label="Autosave Interval (minutes)"
            type="number"
            value={formState.autosaveInterval}
            onChange={(value) => handleInputChange('autosaveInterval', parseInt(value))}
          />
          <Dropdown
            label="Default File Format"
            options={['XLSX', 'CSV', 'PDF']}
            value={formState.defaultFileFormat}
            onChange={(value) => handleInputChange('defaultFileFormat', value)}
          />
        </section>

        <section className="settings-section">
          <h2>Advanced Settings</h2>
          <Input
            label="Function Precision"
            type="number"
            value={formState.functionPrecision}
            onChange={(value) => handleInputChange('functionPrecision', parseInt(value))}
          />
          <Dropdown
            label="Compatibility Mode"
            options={['Excel 2019', 'Excel 2016', 'Excel 2013']}
            value={formState.compatibilityMode}
            onChange={(value) => handleInputChange('compatibilityMode', value)}
          />
        </section>
      </form>
    </div>
  );
};