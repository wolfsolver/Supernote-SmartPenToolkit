import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PluginCommAPI, PluginManager } from 'sn-plugin-lib';
import { loadSettings } from './components/Storage';
import { log } from './components/ConsoleLog';

export default function App() {

    const handleClose = () => {
        PluginManager.closePluginView();
    };

    const insertObjct = () => {
        insertGeometryFromArea(100, 100, 500, 200);
        handleClose();
    }

    async function insertGeometryFromArea(x1: number, y1: number, x2: number, y2: number) {
        const geometry = {
            penColor: 0x9D,
            penType: 10,
            penWidth: 500,
            type: 'GEO_polygon',
            points: [
                { x: x1, y: y1 },
                { x: x2, y: y1 },
                { x: x2, y: y2 },
                { x: x1, y: y2 },
                { x: x1, y: y1 }
            ],
            ellipseCenterPoint: null,
            ellipseMajorAxisRadius: 0,
            ellipseMinorAxisRadius: 0,
            ellipseAngle: 0,
        };

        const res = await PluginCommAPI.insertGeometry(geometry);
        if (!res.success) {
            throw new Error(res.error?.message ?? 'insertGeometry call failed');
        }
        return res.result;
    }

    return (
        <View style={[styles.container]}>
            <View style={[styles.header]}>
                <Text style={[styles.headerTitle]}>
                    Plugin Settings
                </Text>
                <Pressable style={styles.closeButton} onPress={handleClose}>
                    <Text style={[styles.closeText]}>✕</Text>
                </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Pressable onPress={insertObjct}>
                    <Text>TEST</Text>
                </Pressable>
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 20,
    },
    closeButton: {
        padding: 8,
    },
    closeText: {
        fontSize: 22,
        fontWeight: '600',
    },
    scrollContent: {
        padding: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 0.5,
    },
    settingLabel: {
        fontSize: 18,
    },

    toggleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        marginRight: 10,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000',
    },
    switch: {
        width: 60,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    switchOn: {
        backgroundColor: '#000',
    },
    switchOff: {
        backgroundColor: '#333',
    },
    handle: {
        width: 22,
        height: 22,
        backgroundColor: '#fff',
        borderRadius: 11,
    },
    handleOn: {
        alignSelf: 'flex-end',
        // In alternativa puoi usare: transform: [{ translateX: 0 }] 
        // se gestisci il posizionamento con flex
    },
    handleOff: {
        alignSelf: 'flex-start',
    },

});