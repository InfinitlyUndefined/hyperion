import { ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, type ApplicationCommandOptionData, type PermissionResolvable } from "discord.js";

type RunType = {
    [ApplicationCommandType.ChatInput]: ChatInputCommandInteraction,
    [ApplicationCommandType.User]: UserContextMenuCommandInteraction,
    [ApplicationCommandType.Message]: MessageContextMenuCommandInteraction
}

interface BaseCommandOptions<T extends ApplicationCommandType> {
    name: string
    description?: string
    type: T
    defaultMemberPermissions?: PermissionResolvable[] | null
    dmPermission?: boolean
    guildIds?: string[]

    callback: (interaction: RunType[T]) => Promise<void>
}

interface ChatInputCommandOptions extends BaseCommandOptions<ApplicationCommandType.ChatInput> {
    description: string
    type: ApplicationCommandType.ChatInput
    options?: ApplicationCommandOptionData[]

    autoComplete?: (interaction: AutocompleteInteraction) => Promise<void>
}

type CommandOptions<T extends ApplicationCommandType> = T extends ApplicationCommandType.ChatInput ? ChatInputCommandOptions : BaseCommandOptions<T>

export class Command<T extends ApplicationCommandType = ApplicationCommandType> {
    public name: string;
    public description: string
    public type: ApplicationCommandType
    public defaultMemberPermissions: PermissionResolvable[] | null
    public dmPermission?: boolean;
    public options?: ApplicationCommandOptionData[]
    public guildIds?: string[]

    public callback: (interaction: RunType[T]) => Promise<void>
    public autoComplete?: (interaction: AutocompleteInteraction) => Promise<void>

    public constructor(opts: CommandOptions<T>) {
        this.name = opts.name
        this.description = opts.description ?? ""
        this.type = opts.type
        this.defaultMemberPermissions = opts.defaultMemberPermissions ?? null
        this.dmPermission = opts.dmPermission
        this.guildIds = opts.guildIds

        this.callback = opts.callback as (interaction: RunType[T]) => Promise<void>

        if (opts.type === ApplicationCommandType.ChatInput) {
            this.options = opts.options
            
            this.autoComplete = opts.autoComplete
        }
    }
}