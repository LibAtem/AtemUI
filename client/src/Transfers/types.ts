// Note: Copy of the C# types
export interface AtemTransferStatus {
  deviceId: string
  type: string
  queuedAt: string // TODO
  startedAt?: string // TODO
  completedAt?: string // TODO
  success: boolean
  status?: string
  progressPercent: number
}
