"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLEAN_HELP_INFO = exports.STRESS_HELP_INFO = void 0;
exports.STRESS_HELP_INFO = [
    {
        header: 'Stress',
        content: 'Start stress test',
    },
    {
        header: 'Usage',
        content: '$ s cli fc-stress stress <options>',
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'num-user',
                typeLabel: '{underline numUser}',
                description: 'Number of the simulated users.',
                type: Number,
            },
            {
                name: 'spawn-rate',
                typeLabel: '{underline spawnRate}',
                description: 'Increasing number of users per second.',
                type: Number,
            },
            {
                name: 'run-time',
                typeLabel: '{underline time}',
                description: 'Intervals for stress.',
                type: Number,
            },
            {
                name: 'function-type',
                typeLabel: '{underline functionType}',
                description: 'Type of the target function, including event and http.',
                type: String,
            },
            {
                name: 'service-name',
                typeLabel: '{underline serviceName}',
                description: 'Target service, only for --function-type event.',
                type: String,
            },
            {
                name: 'function-name',
                typeLabel: '{underline functionName}',
                description: 'Target function, only for --function-type event.',
                type: String,
            },
            {
                name: 'qualifier',
                typeLabel: '{underline qualifier}',
                description: 'Qualifier of the target function, only for --function-type event.',
                alias: 'q',
                type: String,
            },
            {
                name: 'url',
                typeLabel: '{underline url}',
                description: 'Target url, only for --function-type http.',
                alias: 'u',
                type: String,
            },
            {
                name: 'method',
                typeLabel: '{underline method}',
                description: 'Target method, only for --function-type http.',
                alias: 'm',
                type: String,
            },
            {
                name: 'payload',
                typeLabel: '{underline payload}',
                description: 'For --function-type event, represents the event passed to the function;\nFor --function-type http, represents the request body passed to the function.',
                alias: 'p',
                type: String,
            },
            {
                name: 'payload-file',
                typeLabel: '{underline path}',
                description: 'For --function-type event, contains the event passed to the function;\nFor --function-type http, contains the request body passed to the function.',
                alias: 'f',
                type: String,
            },
        ],
    },
    {
        header: 'Global Options',
        optionList: [
            {
                name: 'region',
                typeLabel: '{underline region}',
                description: 'Target region.',
                alias: 'r',
                type: String,
            },
            {
                name: 'access',
                typeLabel: '{underline access}',
                description: 'Specify key alias.',
                alias: 'a',
                type: String,
            },
            {
                name: 'help',
                description: 'Display help for command.',
                alias: 'h',
                type: Boolean,
            },
        ],
    },
    {
        header: 'Examples with CLI',
        content: [
            "$ s cli fc-stress --num-user 6 --spawn-rate 10 --run-time 30 --function-type event --service-name myService --function-name myFunction --qualifier myQualifier --payload \"hello world\" --region myRegion --access myAccess",
            "$ s cli fc-stress --num-user 6 --spawn-rate 10 --run-time 30 --function-type http --url myUrl --method POST --payload \"hello world\" --region myRegion --access myAccess",
        ],
    },
];
exports.CLEAN_HELP_INFO = [
    {
        header: 'Clean',
        content: 'Clean the relevant resources',
    },
    {
        header: 'Usage',
        content: '$ s cli fc-stress clean <options>',
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'assume-yes',
                description: 'Number of the simulated users.',
                alias: 'y',
                type: Boolean,
            },
        ],
    },
    {
        header: 'Global Options',
        optionList: [
            {
                name: 'region',
                typeLabel: '{underline region}',
                description: 'Target region.',
                alias: 'r',
                type: String,
            },
            {
                name: 'access',
                typeLabel: '{underline access}',
                description: 'Specify key alias.',
                alias: 'a',
                type: String,
            },
            {
                name: 'help',
                description: 'Display help for command.',
                alias: 'h',
                type: Boolean,
            },
        ],
    },
    {
        header: 'Examples with CLI',
        content: [
            "$ s cli fc-stress clean --region myRegion --access myAccess -y",
        ],
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9zdGF0aWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRWEsUUFBQSxnQkFBZ0IsR0FBRztJQUM5QjtRQUNFLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLE9BQU8sRUFBRSxtQkFBbUI7S0FDN0I7SUFDRDtRQUNFLE1BQU0sRUFBRSxPQUFPO1FBQ2YsT0FBTyxFQUFFLG9DQUFvQztLQUM5QztJQUNEO1FBQ0UsTUFBTSxFQUFFLFNBQVM7UUFDakIsVUFBVSxFQUFFO1lBQ1Y7Z0JBQ0UsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLFNBQVMsRUFBRSxxQkFBcUI7Z0JBQ2hDLFdBQVcsRUFBRSxnQ0FBZ0M7Z0JBQzdDLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsWUFBWTtnQkFDbEIsU0FBUyxFQUFFLHVCQUF1QjtnQkFDbEMsV0FBVyxFQUFFLHdDQUF3QztnQkFDckQsSUFBSSxFQUFFLE1BQU07YUFDYjtZQUNEO2dCQUNFLElBQUksRUFBRSxVQUFVO2dCQUNoQixTQUFTLEVBQUUsa0JBQWtCO2dCQUM3QixXQUFXLEVBQUUsdUJBQXVCO2dCQUNwQyxJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLFNBQVMsRUFBRSwwQkFBMEI7Z0JBQ3JDLFdBQVcsRUFBRSx3REFBd0Q7Z0JBQ3JFLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsY0FBYztnQkFDcEIsU0FBUyxFQUFFLHlCQUF5QjtnQkFDcEMsV0FBVyxFQUFFLGlEQUFpRDtnQkFDOUQsSUFBSSxFQUFFLE1BQU07YUFDYjtZQUNEO2dCQUNFLElBQUksRUFBRSxlQUFlO2dCQUNyQixTQUFTLEVBQUUsMEJBQTBCO2dCQUNyQyxXQUFXLEVBQUUsa0RBQWtEO2dCQUMvRCxJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0Q7Z0JBQ0Us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