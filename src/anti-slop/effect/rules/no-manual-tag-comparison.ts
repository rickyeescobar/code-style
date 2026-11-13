import { defineRule } from "@oxlint/plugins";

import {
	isInsideBroadEffectHandler,
	isTagMember,
	tagMemberFromComparison,
} from "../shared/tagged-values.ts";

export const noManualTagComparisonRule = defineRule({
	meta: {
		type: "problem",
		docs: {
			description:
				"Use Effect Match or Predicate helpers instead of manually branching on `_tag`.",
		},
		messages: {
			manualComparison:
				"Use a tag test that the compiler checks: the tagged enum's own `$is('Tag')`, `guards.Tag` of a Schema.TaggedUnion, or Match.tag/Match.tags or an exhaustive Match.valueTags where each variant gets its own branch. Use Predicate.isTagged only for unknown or generic input: it accepts any string, so a wrong tag compiles and the test is always false.",
			manualSwitch:
				"Use the tagged enum `$match` helper, Match.valueTags(value, { ... }), or Match.value(value).pipe(Match.tag/Match.tags/Match.tagsExhaustive) instead of switching on `_tag`. Match.valueTags also rejects an unknown tag; `$match` rejects only a missing one.",
		},
	},
	createOnce(context) {
		return {
			BinaryExpression(node) {
				if (
					tagMemberFromComparison(node) === undefined ||
					isInsideBroadEffectHandler(node)
				) {
					return;
				}
				context.report({ node, messageId: "manualComparison" });
			},
			SwitchStatement(node) {
				if (
					!isTagMember(node.discriminant) ||
					isInsideBroadEffectHandler(node)
				) {
					return;
				}
				context.report({ node, messageId: "manualSwitch" });
			},
		};
	},
});
