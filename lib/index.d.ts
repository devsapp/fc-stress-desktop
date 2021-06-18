import BaseComponent from './common/base';
import { InputProps } from './common/entity';
export default class FcStressComponent extends BaseComponent {
    constructor(props: any);
    private report;
    private argsParser;
    /**
     * stress test
     * @param inputs
     * @returns
     */
    stress(inputs: InputProps): Promise<any>;
    /**
     * clean stress helper function and html report file
     * @param inputs
     * @returns
     */
    clean(inputs: InputProps): Promise<any>;
}
