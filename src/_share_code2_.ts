interface Window {
    electronAPI: {
        searchCard(key: string, filter: {
            men: any,
            career: any,
            role: any
        }): Promise<Array<string>>;
        getAllCards(): Promise<Array<string>>;
        getCfg(): Promise<any>;
        createReport(key: string, role: number, eKey: string, eRole: number, threadNum: number): void;
        feedback(item: string, content: string, fileName?: string, fileBuffer?: ArrayBuffer): Promise<void>;
        viewReport(fightReport: any): void;
        doDebug(): void;
        onProcessOver(callback: (evt: any, data: any) => void): void;
    };
}