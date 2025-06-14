"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { orbitChapters, quizQuestions } from "../../data/orbitChapters";
import ChapterContent from "../../components/ChapterContent";
import SectionNavigation from "../../components/SectionNavigation";
import ProgressBar from "../../components/ProgressBar";
import QuizComponent from "../../components/QuizComponent";
import ChallengeComponent from "../../components/ChallengeComponent";

export default function OrbitChapterPage() {
  const params = useParams();
  const chapterId = params?.chapterId as string;

  const chapter = orbitChapters.find((c) => c.id === chapterId);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  useEffect(() => {
    // Load progress from localStorage or API
    const saved = localStorage.getItem(`orbit-progress-${chapterId}`);
    if (saved) {
      setCompletedSections(JSON.parse(saved));
    }
  }, [chapterId]);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Chapter Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            The Orbit chapter you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const currentSection = chapter.sections[currentSectionIndex];
  const availableSections = chapter.sections.filter(
    (s) => s.status === "available"
  );
  const progress = (completedSections.length / availableSections.length) * 100;

  const handleSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      const newCompleted = [...completedSections, sectionId];
      setCompletedSections(newCompleted);
      localStorage.setItem(
        `orbit-progress-${chapterId}`,
        JSON.stringify(newCompleted)
      );
    }
  };

  const goToNextSection = () => {
    if (currentSectionIndex < chapter.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Chapter Header */}
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{chapter.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {chapter.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {chapter.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {chapter.level} • {chapter.duration}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {chapter.sections.length} sections
              </div>
            </div>
          </div>

          <ProgressBar
            progress={progress}
            completed={completedSections.length}
            total={availableSections.length}
          />
        </motion.div>

        {/* Chapter Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Section Navigation */}
          <div className="lg:col-span-1">
            <SectionNavigation
              sections={chapter.sections}
              currentIndex={currentSectionIndex}
              completedSections={completedSections}
              onSectionSelect={setCurrentSectionIndex}
            />

            {/* Chapter Badge */}
            {chapter.badge && (
              <motion.div
                className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="text-lg font-bold mb-2">
                    {chapter.badge.title}
                  </h3>
                  <p className="text-sm opacity-90">
                    {chapter.badge.description}
                  </p>
                  <div className="mt-4">
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs mt-2 opacity-80">
                      {Math.round(progress)}% Complete
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Capstone Project Preview */}
            {chapter.capstoneProject && (
              <motion.div
                className="mt-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="text-lg font-bold mb-2">
                    Final Project
                  </h3>
                  <p className="text-sm opacity-90">
                    {chapter.capstoneProject.title}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Section Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {currentSection.title}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-sm opacity-90">
                      <span>
                        Section {currentSectionIndex + 1} of{" "}
                        {chapter.sections.length}
                      </span>
                      <span>•</span>
                      <span>{currentSection.estimatedTime}</span>
                      <span>•</span>
                      <span className="capitalize">{currentSection.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {completedSections.includes(currentSection.id) && (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">✅</span>
                        <span className="text-sm">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section Content */}
              <div className="p-8">
                {currentSection.status === "available" ? (
                  <>
                    {currentSection.type === "quiz" ? (
                      <QuizComponent
                        questions={quizQuestions[chapterId] || []}
                        onComplete={() =>
                          handleSectionComplete(currentSection.id)
                        }
                      />
                    ) : currentSection.type === "challenge" ? (
                      <ChallengeComponent
                        section={currentSection}
                        onComplete={() =>
                          handleSectionComplete(currentSection.id)
                        }
                      />
                    ) : (
                      <ChapterContent
                        section={currentSection}
                        chapterId={chapterId}
                        onComplete={() =>
                          handleSectionComplete(currentSection.id)
                        }
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔒</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Coming Soon
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      This section is currently under development and will be
                      available soon.
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center p-6 bg-gray-50 dark:bg-slate-700">
                <button
                  onClick={goToPreviousSection}
                  disabled={currentSectionIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentSectionIndex === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  }`}
                >
                  ← Previous
                </button>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentSectionIndex + 1} / {chapter.sections.length}
                </div>

                <button
                  onClick={goToNextSection}
                  disabled={currentSectionIndex === chapter.sections.length - 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentSectionIndex === chapter.sections.length - 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  }`}
                >
                  Next →
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 