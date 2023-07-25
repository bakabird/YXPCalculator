interface Window {
    electronAPI: {
        searchCard(key: string, filter: {
            men: any,
            career: any,
            role: any
        }): Promise<Array<string>>;
        getAllCards(): Promise<Array<string>>;
        getCfg(): Promise<any>;
        createReport(me: any, he: any, threadNum: number): void;
        feedback(item: string, content: string, fileName?: string, fileBuffer?: ArrayBuffer): Promise<void>;
        viewReport(fightReport: any): void;
        doDebug(): void;
        relaunch(): void;
        onProcessOver(callback: (evt: any, data: any) => void): void;
    };
} 