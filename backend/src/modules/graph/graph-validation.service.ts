import { Injectable } from "@nestjs/common";
import type {
  GraphNode,
  GraphValidationPort,
  GraphRelationshipType,
  GraphNodeType,
} from "@grayscale/platform";

/** Allowed (sourceType, relationship, targetType) tuples */
const RELATIONSHIP_MATRIX: Record<
  string,
  { source: GraphNodeType[]; target: GraphNodeType[] }
> = {
  OWNS: {
    source: ["user", "founder", "company", "department"],
    target: ["project", "task", "bill", "document", "memory"],
  },
  BELONGS_TO: {
    source: ["task", "bill", "memory", "document", "recommendation", "meeting"],
    target: ["project", "company", "department"],
  },
  PART_OF: {
    source: ["git_commit", "task", "document"],
    target: ["project"],
  },
  CREATED: {
    source: ["user", "founder"],
    target: [
      "memory",
      "journal_entry",
      "timeline_event",
      "decision",
      "document",
      "recommendation",
    ],
  },
  DEPENDS_ON: {
    source: ["project", "task", "recommendation", "plugin"],
    target: ["project", "task", "bill", "integration"],
  },
  BLOCKS: {
    source: ["task"],
    target: ["task", "project"],
  },
  REQUIRES: {
    source: ["plugin"],
    target: ["integration"],
  },
  SUPPORTS: {
    source: ["document"],
    target: ["decision", "architecture_decision", "project"],
  },
  REFERENCES: {
    source: ["recommendation", "decision", "document"],
    target: ["memory", "document", "architecture_decision", "git_commit"],
  },
  RECOMMENDED_BY: {
    source: ["recommendation"],
    target: ["future_executive", "user", "founder"],
  },
  CONNECTED_TO: {
    source: ["integration", "plugin"],
    target: ["company", "project"],
  },
  RELATED_TO: {
    source: [
      "memory",
      "journal_entry",
      "timeline_event",
      "knowledge_article",
      "decision",
    ],
    target: [
      "memory",
      "journal_entry",
      "timeline_event",
      "knowledge_article",
      "decision",
      "project",
    ],
  },
  ATTACHED_TO: {
    source: ["document"],
    target: ["project", "task", "meeting", "decision"],
  },
  DISCUSSED_IN: {
    source: ["decision", "architecture_decision"],
    target: ["meeting", "timeline_event"],
  },
  IMPLEMENTS: {
    source: ["git_commit", "task"],
    target: ["decision", "architecture_decision", "recommendation"],
  },
  GENERATED: {
    source: ["future_executive", "plugin", "integration"],
    target: ["recommendation", "memory", "notification"],
  },
  APPROVED_BY: {
    source: ["recommendation", "decision"],
    target: ["founder", "user"],
  },
  ASSIGNED_TO: {
    source: ["task"],
    target: ["user", "founder", "future_executive"],
  },
  UPDATED: {
    source: ["user", "founder", "plugin"],
    target: [
      "memory",
      "project",
      "task",
      "document",
      "decision",
      "bill",
    ],
  },
};

@Injectable()
export class GraphValidationService implements GraphValidationPort {
  async validateEdge(
    _companyId: string,
    sourceNode: GraphNode,
    targetNode: GraphNode,
    relationshipType: GraphRelationshipType,
  ): Promise<{ valid: boolean; reason?: string }> {
    if (sourceNode.id === targetNode.id) {
      return { valid: false, reason: "Self-referencing edges are not allowed" };
    }

    const rule = RELATIONSHIP_MATRIX[relationshipType];
    if (!rule) {
      return { valid: true };
    }

    const sourceOk = rule.source.includes(sourceNode.nodeType as GraphNodeType);
    const targetOk = rule.target.includes(targetNode.nodeType as GraphNodeType);

    if (!sourceOk || !targetOk) {
      return {
        valid: false,
        reason: `Relationship ${relationshipType} not allowed between ${sourceNode.nodeType} and ${targetNode.nodeType}`,
      };
    }

    return { valid: true };
  }
}
