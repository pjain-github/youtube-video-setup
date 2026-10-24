import React from 'react';
import {ArgonHookTitle, ArgonVerdictAgenda, HOOK_FRAMES, VERDICT_FRAMES} from './Part1';
import {ArgonChromiumScale, ArgonPipeline, CHROMIUM_FRAMES, PIPELINE_FRAMES} from './Part2';
import {ArgonBenchmarks, ArgonTerminalBench, BENCH_FRAMES, TERMINAL_FRAMES} from './Part3';
import {ArgonPriceCards, ArgonQuotaMeter, ArgonTierLadder, LADDER_FRAMES, PRICE_FRAMES, QUOTA_FRAMES} from './Part4';
import {ArgonPillars, PILLARS_FRAMES} from './Part5';
import {ArgonChapter, ArgonEndScreen, CHAPTERS, CHAPTER_FRAMES, END_FRAMES} from './Part6';

/**
 * Standalone Gemini 4 Argon animations (cream dot-grid canvas, 1920x1080 @ 30fps).
 * Durations come from video assets/audio/gemini_4_argon via src/data/argon_timings.json.
 * `anim` ids refer to youtube_remotion_animations_gemini_4_argon.md.
 */
export type ArgonItem = {
  id: string;
  anim: string;
  component: React.FC<any>;
  frames: number;
  props?: Record<string, unknown>;
};

export const ARGON_ITEMS: ArgonItem[] = [
  // Between-section cards for the joined video: after the hook, numbered 1..5, 3s each.
  ...[2, 3, 4, 5, 6].map((n) => ({
    id: `ArgonV2Chapter${n - 1}`,
    anim: 'G-01',
    component: ArgonChapter,
    frames: 90,
    props: {n, label: n - 1, total: 5, secs: 3},
  })),
  ...CHAPTERS.map((c) => ({
    id: `ArgonChapter${c.n}`,
    anim: 'G-01',
    component: ArgonChapter,
    frames: CHAPTER_FRAMES,
    props: {n: c.n},
  })),
  {id: 'ArgonHookTitle', anim: 'P1-01+P1-02', component: ArgonHookTitle, frames: HOOK_FRAMES},
  {id: 'ArgonVerdictAgenda', anim: 'P1-07+P1-06', component: ArgonVerdictAgenda, frames: VERDICT_FRAMES},
  {id: 'ArgonPipeline', anim: 'P2-04', component: ArgonPipeline, frames: PIPELINE_FRAMES},
  {id: 'ArgonChromiumScale', anim: 'P2-07', component: ArgonChromiumScale, frames: CHROMIUM_FRAMES},
  {id: 'ArgonBenchmarks', anim: 'P3-02+P3-03', component: ArgonBenchmarks, frames: BENCH_FRAMES},
  {id: 'ArgonTerminalBench', anim: 'P3-07', component: ArgonTerminalBench, frames: TERMINAL_FRAMES},
  {id: 'ArgonPriceCards', anim: 'P4-01', component: ArgonPriceCards, frames: PRICE_FRAMES},
  {id: 'ArgonTierLadder', anim: 'P4-04', component: ArgonTierLadder, frames: LADDER_FRAMES},
  {id: 'ArgonQuotaMeter', anim: 'P4-06', component: ArgonQuotaMeter, frames: QUOTA_FRAMES},
  {id: 'ArgonPillars', anim: 'P5-01..04', component: ArgonPillars, frames: PILLARS_FRAMES},
  {id: 'ArgonEndScreen', anim: 'P6-02+P6-03', component: ArgonEndScreen, frames: END_FRAMES},
];
