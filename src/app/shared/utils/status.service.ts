export namespace Utils {
    export class StatusService {
        static getStatusClass<T extends string>(
            statusMap: Map<T, string>,
            status: T
        ): { [key: string]: boolean } {
            const statusClass = statusMap.get(status) || '';
            return { [statusClass]: true };
        }
    }
}
