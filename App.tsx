/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { ShaderCanvas } from './components/ShaderCanvas';
import { ControlsPanel } from './components/ControlsPanel';
import { EditorPanel } from './components/EditorPanel';
import { LandingOverlay } from './components/LandingOverlay';
import { NewSessionModal } from './components/NewSessionModal';
import { AppProvider, useAppContext } from './context/AppContext';
import { useAppStoreComplete } from './hooks/useAppStore';

const AppContent: React.FC = () => {
    const {
        activeShaderCode,
        allUniforms,
        renderCameraRef,
        isHdEnabled,
        isFpsEnabled,
        isNewSessionModalOpen,
        fileInputRef,
        handleFileChange,
    } = useAppContext();

    return (
        <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden relative font-sans">
             {/* Hidden input for file importing */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".json"
            />
            
            {/* Background Visualizer */}
            <main className={`absolute inset-0 z-0`}>
                {activeShaderCode && (
                    <ShaderCanvas
                        key={activeShaderCode}
                        fragmentSrc={activeShaderCode}
                        onError={() => {}}
                        uniforms={allUniforms}
                        cameraRef={renderCameraRef}
                        isHdEnabled={isHdEnabled}
                        isFpsEnabled={isFpsEnabled}
                        isPlaying={true}
                        shouldReduceQuality={false}
                    />
                )}
            </main>
            
            {/* Business UI Overlay */}
            <LandingOverlay />
            
            {/* Hidden/Pop-up Panels */}
            <ControlsPanel />
            <EditorPanel />
            
            {isNewSessionModalOpen && <NewSessionModal />}
        </div>
    );
};

const App: React.FC = () => {
    const store = useAppStoreComplete();
    return (
        <AppProvider value={store}>
            <AppContent />
        </AppProvider>
    );
};

export default App;