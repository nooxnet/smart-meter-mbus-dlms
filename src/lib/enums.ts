export const enum TelegramState {
	pending,
	available
}

// APDU: application protocol data unit
export const enum ApplicationDataState {
	pending,
	available = 1
}

export const enum ApplicationDataProvisioning {
	lastOnly,
	all
}

export const enum KeySet {
	unicast,
	broadcast
}
