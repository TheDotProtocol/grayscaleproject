import { Injectable } from "@nestjs/common";
import type {
  OrganizationalSignal,
  OrganizationalSignalBusPort,
  OrganizationalSignalSnapshot,
} from "@grayscale/platform";

@Injectable()
export class OrganizationalSignalBusService implements OrganizationalSignalBusPort {
  private readonly signals = new Map<string, OrganizationalSignal[]>();

  async emit(signal: Omit<OrganizationalSignal, "id" | "detectedAt" | "consumed">): Promise<OrganizationalSignal> {
    const record: OrganizationalSignal = {
      ...signal,
      id: crypto.randomUUID(),
      detectedAt: new Date().toISOString(),
      consumed: false,
    };
    const list = this.signals.get(signal.companyId) ?? [];
    list.push(record);
    this.signals.set(signal.companyId, list);
    return record;
  }

  async getActive(companyId: string): Promise<OrganizationalSignal[]> {
    const now = Date.now();
    return (this.signals.get(companyId) ?? []).filter(
      (s) => !s.consumed && (!s.expiresAt || new Date(s.expiresAt).getTime() > now),
    );
  }

  async getSnapshot(companyId: string): Promise<OrganizationalSignalSnapshot> {
    const all = this.signals.get(companyId) ?? [];
    const active = await this.getActive(companyId);
    return {
      companyId,
      assembledAt: new Date().toISOString(),
      activeSignals: active,
      recentSignals: all.slice(-20),
    };
  }

  async markConsumed(signalId: string): Promise<void> {
    for (const [companyId, list] of this.signals.entries()) {
      const idx = list.findIndex((s) => s.id === signalId);
      if (idx >= 0) {
        list[idx] = { ...list[idx]!, consumed: true };
        this.signals.set(companyId, list);
        return;
      }
    }
  }

  async subscribeStrategyConsumer(companyId: string): Promise<OrganizationalSignal[]> {
    return this.getActive(companyId);
  }
}
