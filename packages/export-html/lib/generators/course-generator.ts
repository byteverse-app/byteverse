import { CourseData, Stage, QuizQuestion } from '../content-parser';

export type ImageResult = { url: string; alt?: string };
import { interactiveComponents } from './interactive-components';

export class CourseGenerator {
  generate(
    courseData: CourseData,
    images: ImageResult[],
    bannerImage: ImageResult | null
  ): string {
    const bannerImgUrl = bannerImage?.url || images[0]?.url || '';
    const bannerImages = images.slice(0, 11).map(img => img.url);

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${courseData.title}</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />

<link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Passions+Conflict&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
<link href="https://iconsax.gitlab.io/i/icons.css" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css"/>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/fill/style.css"/>

<style>
${this.getStyles()}
</style>
</head>
<body>

<div class="birb">
    <div id="top"></div>
    <div class="birb-menu">
      <i class="birb-menu1 ph-fill ph-house"></i>
      <div class="birb-nav">
        <a href="#">${courseData.title}</a>
        <a href="#">Microlearning Course</a>
        <a href="#">ByteAI</a>
      </div>
      <div class="birb-log">
        <a href="#" id="bookmarks-toggle">bookmarks</a>
        <div class="bookmarks-dropdown" id="bookmarks-dropdown">
          <div class="bookmarks-dropdown-header">
            <h4>Bookmarked Sections</h4>
            <button class="bookmarks-dropdown-close" id="bookmarks-dropdown-close" type="button">×</button>
          </div>
          <div class="bookmarks-list" id="bookmarks-list">
            <div class="bookmarks-empty">
              <span class="bookmarks-empty-icon">🔖</span>
              <p>No bookmarks yet. Click "Bookmark This Page" on any stage to save it!</p>
            </div>
          </div>
        </div>
      </div>
      <a id="darkmode" class="birb-darkmode"><div></div></a>
    </div>
    <div class="birb-grid">
      ${this.generateSidebar(courseData.stages.length)}
      ${this.generatePopout()}
      ${this.generateUserMenu(courseData)}
      ${this.generateNavMenu(courseData.stages)}
      ${this.generateVideoMenu(courseData)}
      ${this.generatePodcastMenu(courseData)}
      <div class="birb-wrapper">
        ${this.generateBanner(courseData.title, bannerImgUrl, bannerImages)}
        <div class="birb-banner-divide"><div></div></div>
        
        <div class="course" id="course-root">
          <h1 class="title">${courseData.title}</h1>
          <p class="sub">${courseData.description}</p>
          
          <div class="course-nav">
            <button type="button" id="prev-step" disabled>Previous</button>
            <div class="course-progress">
              <div class="course-progress-fill" id="progress-fill"></div>
            </div>
            <span class="course-stage" id="stage-indicator">1/${courseData.stages.length}</span>
            <button type="button" id="next-step">Next</button>
          </div>

          ${this.generateCoursePages(courseData, images)}
          ${this.generateQuiz(courseData.quiz)}
        </div>
      </div>
    </div>
    <div id="bot"></div>
  </div>
  
  <script src="https://code.jquery.com/jquery-1.7.2.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fitty/2.3.6/fitty.min.js"></script>
  <script>
    ${this.generateScript(courseData)}
  </script>
  
  ${this.generateModals()}
</body>
</html>`;
  }

  private generateSidebar(totalStages: number): string {
    return `<div class="birb-sidebar">
        <a href="#" class="birb-sidebar-icon popout">
          <div>
            <svg class="progress-ring" viewBox="0 0 38 38">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:var(--accent1);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:var(--accent2);stop-opacity:1" />
                </linearGradient>
              </defs>
              <circle class="bg-circle" cx="19" cy="19" r="16"></circle>
              <circle class="progress-circle" cx="19" cy="19" r="16" id="circular-progress" stroke-dasharray="100.5" stroke-dashoffset="100.5"></circle>
            </svg>
            <span class="progress-text" id="circular-progress-text">0%</span>
          </div>
        </a>
        <div class="birb-sidebar-divider"></div>
        <a id="usermenu" class="birb-sidebar-tog"><b>course overview</b></a>
        <a id="navmenu" class="birb-sidebar-tog"><b>navigation</b></a>
        <a id="videomenu" class="birb-sidebar-tog"><b>video overview</b></a>
        <a id="podcastmenu" class="birb-sidebar-tog"><b>podcast overview</b></a>
      </div>`;
  }

  private generatePopout(): string {
    return `<div class="birb-popout"><div class="birb-popout2 GID-2">
          <div class="birb-user-av moodboard">
            <div class="birb-user-av3"><div style="background-image:url('${this.getRandomImage()}');"></div></div>
            <div class="birb-user-av3"><div style="background-image:url('${this.getRandomImage()}');"></div></div>
            <div class="birb-user-av3"><div style="background-image:url('${this.getRandomImage()}');"></div></div>
            <div class="birb-user-av3"><div style="background-image:url('${this.getRandomImage()}');"></div></div>
          </div>
          <div class="birb-user-name">
            <h1>course progress</h1>
            <h2>course progress</h2>
          </div>
          <div style="font:var(--font);color:var(--bgInverse);padding:0 20px;line-height:1.6;">
            <p style="margin:0 0 20px 0;text-align:center;">
              <span style="font-size:32px;font-weight:800;display:block;margin-bottom:5px;" id="popout-progress-percent">0%</span>
              <span style="font-size:12px;opacity:0.8;">Complete</span>
            </p>
            <div style="margin:0 0 20px 0;">
              <p style="margin:0 0 10px 0;"><b>Current Stage:</b> <span id="popout-current-stage">1</span> of <span id="popout-total-stages">5</span></p>
              <p style="margin:0 0 10px 0;"><b>Stages Completed:</b> <span id="popout-completed">0</span> / <span id="popout-total">5</span></p>
              <p style="margin:0;"><b>Time Spent:</b> <span id="popout-time">0 min</span></p>
            </div>
            <div class="course-progress" style="margin:0 0 20px 0;">
              <div class="course-progress-fill" id="popout-progress-fill" style="width:0%;"></div>
            </div>
          </div>
        </div></div>`;
  }

  private generateUserMenu(courseData: CourseData): string {
    const stageLinks = courseData.stages.map((stage, i) => 
      `<a href="#" id="stage-link-${i + 1}">stage ${i + 1}: ${stage.title.toLowerCase()}</a>`
    ).join('\n            ');

    return `<div class="birb-user"><div class="birb-user2">
          <div class="birb-user-av">
            <div class="birb-user-av2"><div></div></div>
          </div>
          <div class="birb-user-name">
            <h1>course overview</h1>
            <h2>course overview</h2>
          </div>
          <div class="birb-user-name2">welcome to <b>${courseData.title}</b>! complete all <a href="#" id="total-stages">${courseData.stages.length} stages</a> to finish the course.</div>
          <div class="birb-user-divider"><div></div></div>
          <div class="birb-user-links">
            ${stageLinks}
          </div>
          <div class="birb-user-divider"><div></div></div>
          <div style="font:var(--font);color:var(--bgInverse);padding:0 20px;line-height:1.6;">
            <p style="margin:0 0 15px 0;"><b>Course Duration:</b> ~${courseData.stages.length * 4}-${courseData.stages.length * 5} minutes</p>
            <p style="margin:0 0 15px 0;"><b>Difficulty Level:</b> Intermediate</p>
            <p style="margin:0 0 15px 0;"><b>Learning Objectives:</b></p>
            <ul style="margin:0 0 15px 0;padding-left:20px;">
              ${courseData.stages.map(s => `<li>${s.objective}</li>`).join('\n              ')}
            </ul>
            <p style="margin:0;"><b>Completion:</b> Earn a certificate upon passing the final quiz (≥66% score)</p>
          </div>
      </div></div>`;
  }

  private generateNavMenu(stages: Stage[]): string {
    const stageLinks = stages.map((stage, i) => 
      `<a href="#" data-stage="${i + 1}">${stage.title.toLowerCase()}</a>`
    ).join('\n          ');

    return `<div class="birb-links"><div class="birb-links2"><div class="birb-links3">
        <div>
          <h1>foundations</h1>
          ${stageLinks}
        </div>
      </div></div></div>`;
  }

  private generateVideoMenu(courseData: CourseData): string {
    const stageLinks = courseData.stages.map((stage, i) => 
      `<a href="#" data-stage="${i + 1}">stage ${i + 1}: ${stage.title.toLowerCase()}</a>`
    ).join('\n            ');

    return `<div class="birb-video"><div class="birb-video2">
          <div class="birb-user-av">
            <div class="birb-user-av2"><div></div></div>
          </div>
          <div class="birb-user-name">
            <h1>video overview</h1>
            <h2>video overview</h2>
          </div>
          <div class="birb-user-name2">watch the complete <b>${courseData.title}</b> video lesson with animated typography and narration.</div>
          <div class="birb-user-divider"><div></div></div>
          <div class="birb-user-links">
            <a href="#" id="open-video-modal">watch video lesson</a>
            ${stageLinks}
          </div>
        </div></div>`;
  }

  private generatePodcastMenu(courseData: CourseData): string {
    const stageLinks = courseData.stages.map((stage, i) => 
      `<a href="#" data-stage="${i + 1}">stage ${i + 1}: ${stage.title.toLowerCase()}</a>`
    ).join('\n            ');

    return `<div class="birb-podcast"><div class="birb-podcast2">
          <div class="birb-user-av">
            <div class="birb-user-av2"><div></div></div>
          </div>
          <div class="birb-user-name">
            <h1>podcast overview</h1>
            <h2>podcast overview</h2>
          </div>
          <div class="birb-user-name2">listen to <b>${courseData.title}</b> as a conversational podcast with two speakers.</div>
          <div class="birb-user-divider"><div></div></div>
          <div class="birb-user-links">
            <a href="#" id="open-podcast-modal">play podcast</a>
            ${stageLinks}
          </div>
        </div></div>`;
  }

  private generateBanner(title: string, bannerImg: string, bannerImages: string[]): string {
    const imagesJson = JSON.stringify(bannerImages);
    return `<div class="birb-banner">
          <div class="birb-banner-img"><div class="birb-banner-img2">
            <div style="background-image:url('${bannerImg}');"></div></div></div>
          <div class="birb-banner-stuff">
            <div class="birb-banner-name">${title}</div>
          </div>
        </div>`;
  }

  private generateCoursePages(courseData: CourseData, images: ImageResult[]): string {
    return courseData.stages.map((stage, index) => {
      const stageContent = stage.content || {
        introduction: stage.objective,
        sections: stage.keyPoints.map(kp => ({
          heading: kp,
          content: `Learn about ${kp}`,
          interactiveType: null as any,
        })),
        summary: `Summary of ${stage.title}`,
      };

      // Get images for this stage (distribute images across stages)
      const imagesPerStage = Math.max(1, Math.floor(images.length / courseData.stages.length));
      const stageImages = images.slice(index * imagesPerStage, (index + 1) * imagesPerStage);
      const mainImage = stageImages[0] || images[0] || null;

      // Generate image gallery if multiple images
      const imageGallery = stageImages.length > 1 ? this.generateImageGallery(stageImages) : '';
      
      // Generate main image if available
      const mainImageHtml = mainImage ? `
        <div class="stage-image-container">
          <img src="${mainImage.url}" alt="${mainImage.alt || stage.title}" class="stage-main-image">
          ${mainImage.photographer ? `<p class="image-credit">Photo by ${mainImage.photographer} on ${mainImage.source === 'pexels' ? 'Pexels' : 'Unsplash'}</p>` : ''}
        </div>
      ` : '';

      return `<section class="course-page ${index === 0 ? 'active' : ''}" data-stage="${index + 1}" id="page-${index + 1}">
            <div class="page-card">
              <div class="content-area">
                <h3>${index + 1} — ${stage.title}</h3>
                ${mainImageHtml}
                <p>${stageContent.introduction}</p>

                <div class="progress-checkpoint">
                  <span class="checkpoint-icon">✓</span>
                  <strong>Learning Objective:</strong> ${stage.objective}
                </div>

                ${stageContent.sections.map((section, sectionIndex) => {
                  // Add image between sections occasionally
                  const sectionImage = sectionIndex > 0 && sectionIndex % 2 === 0 && stageImages[sectionIndex % stageImages.length] 
                    ? `<img src="${stageImages[sectionIndex % stageImages.length].url}" alt="${section.heading}" class="section-image" style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 8px; border: 1px solid var(--border);">` 
                    : '';
                  
                  // Generate interactive component if specified
                  let interactiveHtml = '';
                  if (section.interactiveType) {
                    try {
                      const interactiveData = (section as any).interactiveData;
                      if (section.interactiveType === 'fillBlanks' && interactiveData) {
                        interactiveHtml = interactiveComponents.generateFillInTheBlanks(interactiveData);
                      } else if (section.interactiveType === 'matchColumns' && interactiveData) {
                        interactiveHtml = interactiveComponents.generateMatchColumns(interactiveData);
                      } else if (section.interactiveType === 'dragDrop' && interactiveData) {
                        interactiveHtml = interactiveComponents.generateDragDrop(interactiveData);
                      } else if (section.interactiveType === 'imageHotspots' && interactiveData) {
                        interactiveHtml = interactiveComponents.generateImageHotspots(interactiveData);
                      } else if (section.interactiveType === 'timeline' && interactiveData) {
                        interactiveHtml = interactiveComponents.generateTimeline(interactiveData.items || []);
                      } else if (section.interactiveType === 'expandable') {
                        interactiveHtml = `
                          <div class="expandable-section">
                            <div class="expandable-header" onclick="toggleExpand(this, event)">
                              <h5>${(section as any).interactiveContent || section.heading || 'Learn More'}</h5>
                              <span class="expand-icon">▼</span>
                            </div>
                            <div class="expandable-content">
                              <p>${section.content}</p>
                            </div>
                          </div>
                        `;
                      }
                    } catch (error) {
                      console.error('Error generating interactive component:', error);
                    }
                  }

                  return `
                <h4>${section.heading}</h4>
                ${sectionImage}
                <p>${section.content}</p>
                ${interactiveHtml}
                `;
                }).join('\n                ')}

                ${imageGallery}

                <div style="margin-top:20px;">
                  ${index < courseData.stages.length - 1 ? `
                  <button type="button" class="btn" data-action="next" data-stage="${index + 2}">Continue to ${courseData.stages[index + 1]?.title || 'Next Stage'}</button>
                  ` : ''}
                  <button type="button" class="btn secondary" data-action="bookmark" data-stage="${index + 1}">Bookmark This Page</button>
                </div>
              </div>

              <aside class="side-card">
                <h4>Key Points</h4>
                <ul style="font-size:12px;line-height:1.6;">
                  ${stage.keyPoints.map(kp => `<li>${kp}</li>`).join('\n                  ')}
                </ul>
                ${stageImages.length > 0 ? `
                <div style="margin-top: 20px;">
                  <h4>Visual Resources</h4>
                  <div class="side-image-gallery">
                    ${stageImages.slice(0, 3).map(img => `
                      <img src="${img.url}" alt="${img.alt || ''}" style="width: 100%; height: auto; margin: 8px 0; border-radius: 6px; border: 1px solid var(--border);">
                    `).join('')}
                  </div>
                </div>
                ` : ''}
              </aside>
            </div>
          </section>`;
    }).join('\n          ');
  }

  private generateImageGallery(images: ImageResult[]): string {
    if (images.length <= 1) return '';
    
    return `
      <div class="image-gallery" style="margin: 30px 0;">
        <h4>Related Images</h4>
        <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
          ${images.map(img => `
            <div class="gallery-item" style="position: relative; overflow: hidden; border-radius: 8px; border: 1px solid var(--border); cursor: pointer;" onclick="openImageModal('${img.url.replace(/'/g, "\\'")}', '${(img.alt || '').replace(/'/g, "\\'")}')">
              <img src="${img.url}" alt="${img.alt || ''}" style="width: 100%; height: 200px; object-fit: cover; display: block;">
              <div class="gallery-overlay" style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 8px; font-size: 11px;">
                ${img.photographer ? `Photo by ${img.photographer}` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <script>
        function openImageModal(url, alt) {
          const modal = document.createElement('div');
          modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; cursor: pointer;';
          modal.innerHTML = \`<img src="\${url}" alt="\${alt}" style="max-width: 90%; max-height: 90%; object-fit: contain;">\`;
          modal.onclick = () => modal.remove();
          document.body.appendChild(modal);
        }
      </script>
    `;
  }

  private generateQuiz(quiz: QuizQuestion[]): string {
    if (quiz.length === 0) return '';

    return `<section class="course-page" data-stage="${quiz.length + 1}" id="page-${quiz.length + 1}">
            <div class="page-card">
              <div class="content-area">
                <h3>${quiz.length + 1} — Quiz: Test Your Knowledge</h3>
                <p>Answer these questions to check your understanding:</p>

                ${quiz.map((q, i) => `
                <div class="quiz-question" data-qid="${q.id}">
                  <strong>${i + 1})</strong> ${q.question}<br>
                  <span class="choice" data-value="A">${q.options.A}</span>
                  <span class="choice" data-value="B">${q.options.B}</span>
                  <span class="choice" data-value="C">${q.options.C}</span>
                  <span class="choice" data-value="D">${q.options.D}</span>
                </div>
                `).join('\n                ')}

                <div style="margin-top:20px;">
                  <button type="button" class="btn" id="submit-quiz">Submit Quiz</button>
                  <div id="quiz-result" style="margin-top:15px;"></div>
                </div>
              </div>

              <aside class="side-card">
                <h4>Certificate</h4>
                <div id="cert-placeholder">
                  <p>Complete the quiz to earn your certificate!</p>
                </div>
                <div id="certificate" style="display:none;">
                  <h4 style="color:var(--accent1);">🎉 Course Complete!</h4>
                  <p>Congratulations! You've completed the course.</p>
                  <p id="cert-name">Learner</p>
                  <button type="button" class="btn" id="download-cert" style="margin-top:15px;">Download Certificate</button>
                </div>
              </aside>
            </div>
          </section>`;
  }

  private generateScript(courseData: CourseData): string {
    const quizAnswers: Record<string, string> = {};
    courseData.quiz.forEach(q => {
      quizAnswers[q.id] = q.correctAnswer;
    });

    return `(function() {
      'use strict';
      
      var currentStage = 1;
      var totalStages = ${courseData.stages.length + (courseData.quiz.length > 0 ? 1 : 0)};
      var quizAnswers = ${JSON.stringify(quizAnswers)};
      var userAnswers = {};

      function goToStage(stage, isNavigation) {
        if (stage < 1 || stage > totalStages) return;
        currentStage = stage;
        showStage(stage);
        updateProgress();
        localStorage.setItem('course_stage', stage);
        
        if (isNavigation !== false) {
          var courseRootEl = document.getElementById('course-root');
          var birbEl = document.querySelector('.birb');
          if (courseRootEl && birbEl) {
            var courseTop = courseRootEl.offsetTop;
            var containerTop = birbEl.offsetTop;
            var scrollPosition = courseTop - containerTop - 20;
            birbEl.scrollTo({ top: Math.max(0, scrollPosition), behavior: 'smooth' });
          }
        }
      }

      function showStage(stage) {
        document.querySelectorAll('.course-page').forEach(page => page.classList.remove('active'));
        var page = document.getElementById('page-' + stage);
        if (page) page.classList.add('active');
        document.getElementById('prev-step').disabled = stage <= 1;
        document.getElementById('next-step').disabled = stage >= totalStages;
      }

      function updateProgress() {
        var percentage = Math.round(((currentStage - 1) / (totalStages - 1)) * 100);
        document.getElementById('progress-fill').style.width = percentage + '%';
        document.getElementById('stage-indicator').textContent = currentStage + '/' + totalStages;
        
        var circularProgress = document.getElementById('circular-progress');
        var circularText = document.getElementById('circular-progress-text');
        if (circularProgress && circularText) {
          var circumference = 2 * Math.PI * 16;
          var offset = circumference - (percentage / 100) * circumference;
          circularProgress.style.strokeDashoffset = offset;
          circularText.textContent = percentage + '%';
        }
      }

      document.addEventListener('DOMContentLoaded', function() {
        var saved = localStorage.getItem('course_stage');
        if (saved) currentStage = parseInt(saved) || 1;
        showStage(currentStage);
        updateProgress();

        document.getElementById('prev-step').addEventListener('click', function() {
          if (currentStage > 1) goToStage(currentStage - 1, true);
        });

        document.getElementById('next-step').addEventListener('click', function() {
          if (currentStage < totalStages) goToStage(currentStage + 1, true);
        });

        document.querySelectorAll('[data-stage]').forEach(link => {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            var stage = parseInt(this.getAttribute('data-stage'));
            if (stage >= 1 && stage <= totalStages) goToStage(stage, true);
          });
        });

        document.querySelectorAll('.choice').forEach(choice => {
          choice.addEventListener('click', function() {
            var question = this.closest('.quiz-question');
            question.querySelectorAll('.choice').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            userAnswers[question.getAttribute('data-qid')] = this.getAttribute('data-value');
          });
        });

        document.getElementById('submit-quiz')?.addEventListener('click', function() {
          var score = 0;
          var total = Object.keys(quizAnswers).length;
          for (var qid in quizAnswers) {
            if (userAnswers[qid] === quizAnswers[qid]) score++;
          }
          var percentage = Math.round((score / total) * 100);
          document.getElementById('quiz-result').innerHTML = '<div class="badge">Score: ' + score + ' / ' + total + ' (' + percentage + '%)</div>';
          if (percentage >= 66) {
            document.getElementById('certificate').style.display = 'block';
            document.getElementById('cert-placeholder').style.display = 'none';
          }
        });
      });

      window.toggleExpand = function(element, e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        var content = element.nextElementSibling;
        var icon = element.querySelector('.expand-icon');
        content.classList.toggle('show');
        icon.classList.toggle('expanded');
        return false;
      };
    })();`;
  }

  private generateModals(): string {
    return `<div class="glass-popup-overlay" id="popup-overlay"></div>
  <div class="glass-popup" id="glass-popup">
    <div class="glass-popup-content">
      <span class="popup-icon" id="popup-icon"></span>
      <h4 id="popup-title"></h4>
      <p id="popup-message"></p>
      <button class="popup-button" onclick="document.getElementById('glass-popup').classList.remove('show')">OK</button>
    </div>
  </div>
  
  <div class="glass-popup-overlay" id="video-modal-overlay"></div>
  <div class="video-modal" id="video-modal">
    <div class="video-modal-content">
      <div class="video-modal-header">
        <h3>Video Lesson</h3>
        <button class="video-modal-close" id="video-modal-close" type="button">×</button>
      </div>
      <div class="video-preview">
        <iframe id="video-iframe" src="video.html" style="width:100%;height:calc(100vh - 180px);min-height:600px;border:none;border-radius:10px;display:block;"></iframe>
      </div>
      <div class="video-modal-actions">
        <button type="button" class="secondary" onclick="document.getElementById('video-modal').classList.remove('show')">Close</button>
      </div>
    </div>
  </div>

  <div class="glass-popup-overlay" id="podcast-modal-overlay"></div>
  <div class="podcast-modal" id="podcast-modal">
    <div class="podcast-modal-content">
      <div class="podcast-modal-header">
        <h3>Podcast</h3>
        <button class="podcast-modal-close" id="podcast-modal-close" type="button">×</button>
      </div>
      <div class="podcast-preview">
        <iframe id="podcast-iframe" src="podcast.html" style="width:100%;height:calc(100vh - 180px);min-height:400px;border:none;border-radius:10px;display:block;" allow="autoplay"></iframe>
      </div>
      <div class="podcast-modal-actions">
        <button type="button" class="secondary" onclick="document.getElementById('podcast-modal').classList.remove('show')">Close</button>
      </div>
    </div>
  </div>`;
  }

  private getRandomImage(): string {
    // Return a placeholder or random image URL
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400';
  }

  private getStyles(): string {
    // Include interactive component styles
    const interactiveStyles = interactiveComponents.getComponentStyles();
    
    return `@font-face { font-family: 'Calora'; src: url('https://files.jcink.net/uploads2/strangefrontier/fonts/Calora.woff'); }
@font-face { font-family: 'Calora Italic'; src: url('https://files.jcink.net/uploads2/strangefrontier/fonts/Calora_Italic.woff'); }
html, body { margin:0px;padding:0px;height:100%;overflow:hidden; }
body { background-color:var(--bg1); --bg1: #e0e0e0; --bg2: #dddddd; --bg3: #d5d5d5; --bg4: #bdbdbd; --bgInverse: #191919; --bgInverse2: #151515; --border: #191919; --text: #333; --textOutline: var(--border) 1px 0px 0px, var(--border) 0.540302px 0.841471px 0px, var(--border) -0.416147px 0.909297px 0px, var(--border) -0.989993px 0.14112px 0px, var(--border) -0.653644px -0.756803px 0px, var(--border) 0.283662px -0.958924px 0px, var(--border) 0.96017px -0.279416px 0px; --accent1: #4a90e2; --accent2: #50c9c3; --inter: 'Inter', sans-serif; --calora: 'Calora', serif; --calora2: 'Calora Italic', serif; --font: 13px / 20px var(--inter); --transition:.3s; --bannerImg: url(''); --defaultIcon: url(''); }
body.darkmode { }
.GID-2 { --accent1: #9c93cc; --accent2: #ad8ed4; }
.birb { font:var(--font);color:var(--bgInverse);scrollbar-width:thin;scrollbar-color:var(--bgInverse) var(--bg1);height:100vh;overflow-y:auto;overflow-x:hidden;scroll-behavior: smooth; }
.birb::before { content:'';display:none;position:fixed;bottom:0px;right:0px; background:radial-gradient(at bottom right,transparent,#fff 70%), linear-gradient(45deg,var(--accent1) 15%,var(--accent2) 85%);height:600px;width:600px;border-radius:100% 0 0 0;border-top:solid 2px #fff;border-left:solid 2px #fff;mix-blend-mode:multiply; }
.birb a { text-decoration:none;color:var(--accent1); }
.birb-menu { display:flex;gap:15px; border-right:solid 1px var(--border);border-bottom:solid 1px var(--border);padding:20px;position:sticky;z-index:1000;top:0px;text-transform:uppercase;letter-spacing:2px; background:linear-gradient(to right,var(--bg1) 15%,transparent 45% 55%,var(--bg1) 85%), linear-gradient(to right,var(--accent1) 15%,var(--accent2) 85%); }
.birb-menu::before { content:'';display:block;background-color:var(--bg1);position:absolute;top:0px;bottom:0px;right:0px;left:0px;opacity:0; }
.birb-menu1 { margin-top:-1px;height:10px;display:block;position:relative;color:var(--bg1);text-shadow:var(--textOutline); }
.birb-menu a { font:500 11px / 10px var(--inter);color:var(--bgInverse); }
.birb-nav, .birb-log { position:relative;z-index:1;display:flex;gap:15px; }
.birb-nav { flex-grow:1; }
.birb-nav a:first-of-type { font-weight:800!important; }
.birb-log { position:relative; }
.birb-darkmode { padding:2px;border:solid 1px var(--border);display:block;border-radius:10px;width:20px;margin:-1px 0px;cursor:pointer;position:relative;z-index:1; }
.birb-darkmode div { width:6px;position:relative;height:100%;transition:var(--transition); }
.birb-darkmode.toggled div { width:20px; }
.birb-darkmode div::before { display:block;content:'';position:absolute;top:0px;bottom:0px;right:0px;border:solid 1px var(--border);background:linear-gradient(to right,var(--accent2),var(--accent1));width:4px;border-radius:100%; }
.birb-grid { min-height:auto;border-right:solid 1px var(--border);display:grid;grid-template-columns:101px auto auto auto auto auto 1fr;position:relative;z-index:1; }
.birb-sidebar { position:relative;z-index:10;border-right:solid 1px var(--border);display:flex;flex-direction:column;align-items:center;gap:15px;padding:30px;position:sticky;top:51px;height:calc(100vh - 111px); background:linear-gradient(to bottom,var(--bg1) 50%,transparent), linear-gradient(to bottom,var(--accent1) 65%,var(--accent2)); }
.birb-sidebar::before { content:'';display:block;background-color:var(--bg1);position:absolute;top:0px;bottom:0px;right:0px;left:0px;opacity:0; }
.birb-sidebar-icon { position:relative;z-index:1;padding:4px;border:solid 1px var(--border);border-radius:100%; }
.birb-sidebar-icon div { height:30px;width:30px;background-color:var(--bg1);background-image:var(--defaultIcon);background-blend-mode:multiply;background-size:cover;background-position:center;border-radius:100%;position:relative; }
.birb-sidebar-icon .progress-ring { position:absolute;top:0;left:0;width:100%;height:100%;transform:rotate(-90deg); }
.birb-sidebar-icon .progress-ring circle { fill:none;stroke-width:3;stroke-linecap:round; }
.birb-sidebar-icon .progress-ring .bg-circle { stroke:var(--bg3); }
.birb-sidebar-icon .progress-ring .progress-circle { stroke:url(#progressGradient);transition:stroke-dashoffset 0.3s; }
.birb-sidebar-icon .progress-text { position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font:600 8px/1 var(--inter);color:var(--bgInverse);text-align:center; }
.birb-sidebar-icon svg { position:absolute;top:0;left:0;width:100%;height:100%; }
.birb-sidebar-jump { position:relative;z-index:1;display:block;border:solid 1px var(--border);border-radius:100%;height:38px;width:38px;display:flex;align-items:center;justify-content:center;font-size:20px; }
.birb-sidebar-tog { position:relative;z-index:1;display:block;border:solid 1px var(--border);border-radius:50px;text-transform:uppercase;padding:19px 14px;white-space:nowrap;writing-mode:vertical-rl;letter-spacing:1px;cursor:pointer; }
.birb-sidebar-tog:last-of-type { background-color:var(--bgInverse); }
.birb-sidebar-tog b { font:500 12px / 10px var(--inter);display:block;transform:rotate(-180deg); }
.birb-sidebar-tog:last-of-type b { color:var(--bg1)!important; }
.birb-sidebar a { transition:var(--transition);background-color:var(--bg1);color:var(--bgInverse)!important; }
.birb-sidebar a:hover { background-color:var(--bgInverse);color:var(--bg1)!important; }
.birb-sidebar-divider { width:1px;flex-grow:1;background-color:var(--border);position:relative;z-index:1;display:flex;flex-direction:column;justify-content:space-between;margin:35px 0px; }
.birb-sidebar-divider::before, .birb-sidebar-divider::after { content:'';position:absolute;left:50%;transform:translateX(-50%);width:7px;height:7px;border-radius:100%;background-color:var(--border); }
.birb-sidebar-divider::before { top:0; }
.birb-sidebar-divider::after { bottom:0; }
.birb-popout { border-right:solid 1px var(--border);margin-left:-1px;width:0px;transition:var(--transition);position:sticky;top:51px;height:calc(100vh - 51px);overflow:hidden; }
.birb-popout2 { height:calc(100vh - 151px);width:250px;padding:50px;height:calc(100vh - 151px);position:relative;display:flex;flex-direction:column; background:linear-gradient(to top,var(--bg1) 50%,transparent), linear-gradient(to bottom,var(--accent1),var(--accent2) 35%); }
.birb-user { border-right:solid 1px var(--border);margin-left:-1px;width:0px;transition:var(--transition);position:sticky;top:51px;height:calc(100vh - 51px);overflow:hidden; }
.birb-user2 { width:250px;padding:50px;height:calc(100vh - 151px);position:relative;display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:var(--bgInverse) var(--bg1); background:linear-gradient(to top,var(--bg1) 50%,transparent), linear-gradient(to bottom,var(--accent1),var(--accent2) 35%); }
.birb-user2::-webkit-scrollbar { width:6px; }
.birb-user2::-webkit-scrollbar-track { background:var(--bg1); }
.birb-user2::-webkit-scrollbar-thumb { background:var(--bgInverse);border-radius:3px; }
.birb-user2::-webkit-scrollbar-thumb:hover { background:var(--bg4); }
.birb-user-av { position:relative;display:flex;align-items:center;justify-content:center; }
.birb-user-av2, .birb-user-av3 { background-color:var(--bgInverse);border:solid 1px var(--border);width:calc(100% - 2px);padding-top:100%;position:relative;border-radius:100%; }
.birb-user-av2::before, .birb-user-av3::before { position:absolute;z-index:1;content:'';display:block;top:0px;bottom:0px;left:0px;right:0px;border:solid 10px var(--bg1);border-radius:100%; }
.birb-user-av2 div, .birb-user-av3 div { position:absolute;top:10px;bottom:10px;left:10px;right:10px;background-color:var(--bg1);background-image:var(--defaultIcon);background-blend-mode:multiply;mix-blend-mode:lighten;background-size:cover;background-position:center;border-radius:100%; }
.birb-user-av.moodboard { display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:10px; }
.birb-user-av.moodboard::before { position:absolute;content:'';display:block;height:8px;width:8px;background-color:var(--bg1);border:solid 1px var(--border);border-radius:100%;left:calc(50% - 5px); }
.birb-user-av3:nth-child(1) { border-radius:100% 20px 20px 20px; }
.birb-user-av3:nth-child(1)::before { border-radius:calc(100% - 3px) 18px 18px 18px; }
.birb-user-av3:nth-child(1) div { border-radius:100% 10px 10px 10px;top:9px;left:9px;bottom:9px;right:9px; }
.birb-user-av3:nth-child(2) { border-radius:20px 100% 20px 20px; }
.birb-user-av3:nth-child(2)::before { border-radius:18px calc(100% - 3px) 18px 18px; }
.birb-user-av3:nth-child(2) div { border-radius:10px 100% 10px 10px;top:9px;left:9px;bottom:9px;right:9px; }
.birb-user-av3:nth-child(3) { border-radius:20px 20px 20px 100%; }
.birb-user-av3:nth-child(3)::before { border-radius:18px 18px 18px calc(100% - 3px); }
.birb-user-av3:nth-child(3) div { border-radius:10px 10px 10px 100%;top:9px;left:9px;bottom:9px;right:9px; }
.birb-user-av3:nth-child(4) { border-radius:20px 20px 100% 20px; }
.birb-user-av3:nth-child(4)::before { border-radius:18px 18px calc(100% - 3px) 18px; }
.birb-user-av3:nth-child(4) div { border-radius:10px 10px 100% 10px;top:9px;left:9px;bottom:9px;right:9px; }
.birb-user-name { position:relative;z-index:1;margin:-25px 0px 15px 0px; }
.birb-user-name h1, .birb-user-name h2 { margin:0px;font:35px / 80% var(--calora);text-transform:uppercase; }
.birb-user-name h1 div, .birb-user-name h2 div { text-transform:lowercase;text-shadow:var(--textOutline);position:relative;color:var(--bg1); }
.birb-user-name h2 { position:absolute;left:0px;top:0px;color:transparent; }
.birb-user-name h2 div { text-shadow:none;background:linear-gradient(to right,var(--accent2),var(--accent1), transparent 50%);padding:30px 0px;margin:-30px 0px;background-clip:text;-webkit-background-clip:text;color:transparent;max-width:fit-content; }
.birb-user-name2 { text-transform:uppercase;font:400 12px / 15px var(--inter);letter-spacing:.5px; }
.birb-user-name2 b { font-weight:800!important; }
.birb-user-name2 a { font:800 12px / 15px var(--inter);background:linear-gradient(to right,var(--accent2),var(--accent1));background-clip:text;-webkit-background-clip:text;color:transparent;max-width:fit-content; }
.birb-user-links { display:flex;flex-wrap:wrap;gap:15px;flex-grow:1;align-content:center;margin-bottom:25px; }
.birb-user-links a { display:block;font:800 11px / 10px var(--inter);text-transform:uppercase;color:var(--bgInverse);letter-spacing:.5px;position:relative;padding-left:23px; }
.birb-user-links a::before { display:block;position:absolute;content:'*';font:33px / 28px var(--calora);left:0px;background:linear-gradient(to right,var(--accent2),var(--accent1));background-clip:text;-webkit-background-clip:text;color:transparent;max-width:fit-content; }
.birb-user-divider { flex-grow:1;display:flex;align-items:center; }
.birb-user-divider div { height:1px;background-color:var(--border);position:relative;z-index:1;display:flex;justify-content:space-between;margin:35px 30px 25px 30px;flex-grow:1; }
.birb-user-divider div::before, .birb-user-divider div::after { content:'';display:block;width:7px;height:7px;border-radius:100%;background-color:var(--border);margin-top:-3px; }
.birb-user-sub { display:flex;gap:10px;flex-wrap:wrap;max-height:120px;overflow:auto; }
.birb-user-sub a { display:block;background-color:var(--bg1);border:solid 1px var(--border);padding:5px;border-radius:100%; }
.birb-user-sub a div { height:43px;width:43px;background-image:var(--defaultIcon);background-position:center;background-size:cover;border-radius:100%;mix-blend-mode:multiply; }
.birb-links { border-right:solid 1px var(--border);margin-left:-1px;width:0px;transition:var(--transition);position:sticky;top:51px;height:calc(100vh - 51px);overflow:hidden; }
.birb-links2 { padding:50px;width:250px;height:calc(100vh - 151px);overflow-y:auto;overflow-x:hidden;scrollbar-width:thin; }
.birb-links3 { display:flex;flex-direction:column;gap:30px;min-height:100%;justify-content:space-between; }
.birb-links3 h1 { margin:0px 0px 20px 0px;font:400 35px / 30px var(--calora);text-transform:lowercase; }
.birb-links3 h1::after { content:'';display:block;border:solid 1px var(--border);border-radius:5px;height:3px;background:linear-gradient(to right,var(--accent1),var(--accent2),var(--bg1) 75%);margin-top:15px; }
.birb-links3 div { counter-reset: birbNav; }
.birb-links3 div a { display:block;color:var(--bgInverse);text-transform:uppercase;font:800 12px / 18px var(--inter);letter-spacing:1px;counter-increment: birbNav; }
.birb-links3 div a::before { content:'0' counter(birbNav) '.';background:linear-gradient(135deg,var(--accent2),var(--accent1));background-clip:text;-webkit-background-clip:text;color:transparent!important;margin-right:10px; }
.birb-video { border-right:solid 1px var(--border);margin-left:-1px;width:0px;transition:var(--transition);position:sticky;top:51px;height:calc(100vh - 51px);overflow:hidden; }
.birb-video2 { width:250px;padding:50px;height:calc(100vh - 151px);position:relative;display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:var(--bgInverse) var(--bg1); background:linear-gradient(to top,var(--bg1) 50%,transparent), linear-gradient(to bottom,var(--accent1),var(--accent2) 35%); }
.birb-video2::-webkit-scrollbar { width:6px; }
.birb-video2::-webkit-scrollbar-track { background:var(--bg1); }
.birb-video2::-webkit-scrollbar-thumb { background:var(--bgInverse);border-radius:3px; }
.birb-video2::-webkit-scrollbar-thumb:hover { background:var(--bg4); }
.birb-video2::before, .birb-podcast2::before { display:block;content:'*';position:absolute;z-index:10;top:210px;right:35px;text-shadow:var(--textOutline);font:412px / 0px var(--calora);color:var(--bg1); }
.birb-podcast { border-right:solid 1px var(--border);margin-left:-1px;width:0px;transition:var(--transition);position:sticky;top:51px;height:calc(100vh - 51px);overflow:hidden; }
.birb-podcast2 { width:250px;padding:50px;height:calc(100vh - 151px);position:relative;display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:var(--bgInverse) var(--bg1); background:linear-gradient(to top,var(--bg1) 50%,transparent), linear-gradient(to bottom,var(--accent1),var(--accent2) 35%); }
.birb-podcast2::-webkit-scrollbar { width:6px; }
.birb-podcast2::-webkit-scrollbar-track { background:var(--bg1); }
.birb-podcast2::-webkit-scrollbar-thumb { background:var(--bgInverse);border-radius:3px; }
.birb-podcast2::-webkit-scrollbar-thumb:hover { background:var(--bg4); }
.birb-user2::before, .birb-popout2::before, .birb-video2::before, .birb-podcast2::before { display:block;content:'*';position:absolute;z-index:10;top:210px;right:35px;text-shadow:var(--textOutline);font:412px / 0px var(--calora);color:var(--bg1); }
.birb-grid.usermenu .birb-user, .birb-grid.navmenu .birb-links, .birb-grid.popout2 .birb-popout, .birb-grid.videomenu .birb-video, .birb-grid.podcastmenu .birb-podcast { width:350px;z-index:1; }
.birb-wrapper { padding:85px; }
.birb-banner-img { background-color:var(--bgInverse);border:solid 1px var(--border);border-radius:150px; }
.birb-banner-img2 { position:relative;height:250px;background-color:var(--bg1);background:linear-gradient(to right,var(--accent1),var(--accent2));mix-blend-mode:lighten;border-radius:149px; }
.birb-banner-img2::before { display:block;content:'';position:absolute;z-index:2;top:0px;bottom:0px;left:0px;right:0px;border:solid 10px var(--bg1);border-radius:149px; }
.birb-banner-img2 div { background-image:var(--bannerImg);height:100%;width:100%;background-size:cover;background-position:center;mix-blend-mode:multiply;filter:grayscale(100%);border-radius:149px;transition:opacity 2s ease-in-out; }
.birb-banner-img2 div.fade-out { opacity:0; }
.birb-banner-stuff { display:flex;flex-wrap:wrap;gap:50px;margin:50px 0px 0px 0px;border-bottom:solid 0px var(--border);padding-bottom:70px;position:relative; }
.birb-banner-sub { border:solid 1px var(--border);border-radius:100%;height:65px;width:120px;position:absolute;z-index:2;background:linear-gradient(135deg,var(--accent2),var(--accent1));background:var(--bgInverse);display:flex;align-items:center;justify-content:center;padding:70px 15px 30px 30px;text-align:right;font:800 15px / 15px var(--inter);color:var(--bg1);text-transform:uppercase;margin-top:-15px; }
.birb-banner-sub::before { display:block;content:'';position:absolute;z-index:2;top:0px;bottom:0px;left:0px;right:0px;border:solid 10px var(--bg1);border-radius:100%; }
.birb-banner-sub::after { display:block;content:'*';position:absolute;z-index:2;bottom:-92px;right:30px;text-shadow:var(--textOutline);font:300px / 0px var(--calora); }
.birb-banner-name { position:relative;z-index:1;text-transform:uppercase;font:400 120px / 1.2 var(--calora);padding:0;margin:0;text-align:center;width:100%;background:linear-gradient(to right, var(--accent2), var(--accent1));background-clip:text;-webkit-background-clip:text;color:transparent; }
.birb-banner-divide { margin:60px auto 135px auto;width:65%;display:flex;align-items:center;justify-content:center;position:relative; }
.birb-banner-divide::before { display:block;content:'*';position:absolute;z-index:2;color:var(--bg1);text-shadow:var(--textOutline);font:300px / 0px var(--calora);background-color:var(--bg1);padding:100px 50px 0px 50px;height:0px;top:-12px; }
.birb-banner-divide div { height:1px;background-color:var(--border);position:relative;z-index:1;display:flex;justify-content:space-between;flex-grow:1; }
.birb-banner-divide div::before, .birb-banner-divide div::after { content:'';display:block;width:7px;height:7px;border-radius:100%;background-color:var(--border);margin-top:-3px; }
.course { background-color:var(--bg1);border:solid 1px var(--border);border-radius:20px;padding:40px;margin-bottom:30px; }
.course .title { font:400 45px / 50px var(--calora);text-transform:uppercase;margin:0 0 10px 0;color:var(--bgInverse); }
.course .sub { font:400 18px / 24px var(--inter);color:var(--bgInverse);margin-bottom:30px;opacity:0.8; }
.course-nav { display:flex;gap:15px;align-items:center;margin-bottom:30px;padding-bottom:20px;border-bottom:1px solid var(--border); }
.course-nav button { border:solid 1px var(--border);border-radius:50px;padding:12px 24px;font:800 12px / 10px var(--inter);text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:var(--transition);background-color:var(--bg1);color:var(--bgInverse); }
.course-nav button:hover:not(:disabled) { background-color:var(--bgInverse);color:var(--bg1); }
.course-nav button:disabled { opacity:0.5;cursor:not-allowed; }
.course-progress { flex-grow:1;height:8px;background-color:var(--bg3);border-radius:4px;overflow:hidden;position:relative; }
.course-progress-fill { height:100%;background:linear-gradient(to right,var(--accent1),var(--accent2));transition:width 0.3s;width:0%; }
.course-stage { font:800 14px / 10px var(--inter);text-transform:uppercase;letter-spacing:1px;color:var(--bgInverse);white-space:nowrap; }
.course-page { display:none; }
.course-page.active { display:block; }
.page-card { display:grid;grid-template-columns:1fr 300px;gap:30px; }
.content-area h3 { font:400 35px / 40px var(--calora);text-transform:uppercase;margin:0 0 20px 0;color:var(--bgInverse); }
.content-area h4 { font:800 16px / 20px var(--inter);text-transform:uppercase;margin:20px 0 10px 0;color:var(--bgInverse); }
.content-area p { font:var(--font);color:var(--bgInverse);margin:0 0 15px 0;line-height:1.6; }
.content-area ul { margin:15px 0;padding-left:20px; }
.content-area li { font:var(--font);color:var(--bgInverse);margin:8px 0;line-height:1.6; }
.side-card { background-color:var(--bg2);border:solid 1px var(--border);border-radius:15px;padding:25px; }
.side-card h4 { font:800 18px / 22px var(--inter);text-transform:uppercase;margin:0 0 15px 0;color:var(--bgInverse); }
.side-card p { font:var(--font);color:var(--bgInverse);margin:0;line-height:1.6; }
.btn { border:solid 1px var(--border);border-radius:50px;padding:14px 28px;font:800 12px / 10px var(--inter);text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:var(--transition);background:linear-gradient(to right,var(--accent1),var(--accent2));color:var(--bg1);border:none; }
.btn:hover { opacity:0.9;transform:translateY(-2px); }
.btn.secondary { background:var(--bg1);color:var(--bgInverse);border:solid 1px var(--border); }
.btn.secondary:hover { background-color:var(--bgInverse);color:var(--bg1); }
.quiz-question { margin:25px 0;padding:20px;background-color:var(--bg2);border-radius:10px;border:1px solid var(--border); }
.quiz-question strong { font:800 16px / 20px var(--inter);color:var(--bgInverse); }
.choice { display:inline-block;padding:12px 20px;margin:8px 8px 8px 0;background-color:var(--bg1);border:2px solid var(--border);border-radius:8px;cursor:pointer;transition:var(--transition);font:var(--font);color:var(--bgInverse); }
.choice:hover { background-color:var(--bg3); }
.choice.selected { background:linear-gradient(to right,var(--accent1),var(--accent2));color:var(--bg1);border-color:transparent; }
.badge { display:inline-block;padding:8px 16px;background:linear-gradient(to right,var(--accent1),var(--accent2));color:var(--bg1);border-radius:20px;font:800 14px / 18px var(--inter);text-transform:uppercase; }
.interactive-demo { background:var(--bg2);border:2px solid var(--border);border-radius:12px;padding:20px;margin:20px 0; }
.interactive-demo h5 { margin:0 0 15px 0;font:800 14px/18px var(--inter);text-transform:uppercase;color:var(--bgInverse); }
.code-editor { background:var(--bgInverse);color:var(--bg1);padding:15px;border-radius:8px;font:13px/20px 'Courier New',monospace;margin:10px 0;position:relative; }
.code-editor pre { margin:0;white-space:pre-wrap;word-wrap:break-word; }
.run-button { background:linear-gradient(to right,var(--accent1),var(--accent2));color:var(--bg1);border:none;padding:8px 16px;border-radius:6px;font:800 11px/14px var(--inter);text-transform:uppercase;cursor:pointer;margin-top:10px;transition:opacity 0.3s; }
.run-button:hover { opacity:0.9; }
.output-box { background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;margin-top:10px;min-height:40px;font:13px/18px 'Courier New',monospace;color:var(--bgInverse);display:none;max-height:0;overflow:hidden;transition:max-height 0.3s ease-out,padding 0.3s ease-out; }
.output-box.show { display:block;max-height:500px;transition:max-height 0.5s ease-in,padding 0.3s ease-in; }
.expandable-section { margin:20px 0; }
.expandable-header { background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:12px 15px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:background 0.3s; }
.expandable-header:hover { background:var(--bg3); }
.expandable-header h5 { margin:0;font:800 13px/16px var(--inter);text-transform:uppercase;color:var(--bgInverse); }
.expandable-content { display:none;padding:15px;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;background:var(--bg1);max-height:0;overflow:hidden;transition:max-height 0.3s ease-out,padding 0.3s ease-out; }
.expandable-content.show { display:block;max-height:2000px;transition:max-height 0.5s ease-in,padding 0.3s ease-in; }
.expand-icon { transition:transform 0.3s;font-size:18px; }
.expand-icon.expanded { transform:rotate(180deg); }
.drag-drop-container { display:flex;gap:15px;margin:20px 0;flex-wrap:wrap; }
.drag-zone, .drop-zone { flex:1;min-width:200px;min-height:150px;border:2px dashed var(--border);border-radius:8px;padding:15px;background:var(--bg2); }
.drag-zone { background:var(--bg3); }
.drag-item { background:var(--bg1);border:2px solid var(--border);border-radius:6px;padding:10px;margin:8px 0;cursor:move;transition:all 0.3s;text-align:center;font:800 11px/14px var(--inter);text-transform:uppercase; }
.drag-item:hover { background:var(--bgInverse);color:var(--bg1);transform:translateY(-2px); }
.drag-item.dragging { opacity:0.5; }
.drop-zone.drag-over { border-color:var(--accent1);background:var(--bg3); }
.drop-zone.correct { border-color:#4caf50;background:#e8f5e9; }
.drop-zone.incorrect { border-color:#f44336;background:#ffebee; }
.interactive-diagram { background:var(--bg2);border:2px solid var(--border);border-radius:12px;padding:20px;margin:20px 0;text-align:center; }
.diagram-element { display:inline-block;background:var(--bg1);border:2px solid var(--border);border-radius:8px;padding:15px 20px;margin:10px;cursor:pointer;transition:all 0.3s;font:800 12px/14px var(--inter);text-transform:uppercase; }
.diagram-element:hover { background:var(--accent1);color:var(--bg1);border-color:var(--accent1);transform:scale(1.05); }
.diagram-element.active { background:linear-gradient(to right,var(--accent1),var(--accent2));color:var(--bg1);border-color:transparent; }
.tooltip-trigger { border-bottom:2px dotted var(--accent1);cursor:help;position:relative; }
.tooltip { display:none;position:absolute;background:var(--bgInverse);color:var(--bg1);padding:8px 12px;border-radius:6px;font:12px/16px var(--inter);z-index:1000;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:5px;white-space:nowrap; }
.tooltip-trigger:hover .tooltip { display:block; }
.tooltip::after { content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:var(--bgInverse); }
.matching-exercise { display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:20px 0; }
.match-item { background:var(--bg2);border:2px solid var(--border);border-radius:8px;padding:12px;cursor:pointer;transition:all 0.3s;text-align:center;font:800 11px/14px var(--inter);text-transform:uppercase; }
.match-item:hover { background:var(--bg3);transform:translateY(-2px); }
.match-item.selected { background:linear-gradient(to right,var(--accent1),var(--accent2));color:var(--bg1);border-color:transparent; }
.match-item.matched { background:#4caf50;color:var(--bg1);border-color:#4caf50;cursor:default; }
.glass-popup { position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);z-index:10000;display:none; }
.glass-popup.show { display:block;animation:fadeInScale 0.3s ease-out; }
.glass-popup-overlay { position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(5px);z-index:9999;display:none; }
.glass-popup-overlay.show { display:block;animation:fadeIn 0.3s ease-out; }
.glass-popup-content { background:rgba(224,224,224,0.9);backdrop-filter:blur(20px);border:2px solid rgba(25,25,25,0.3);border-radius:20px;padding:30px 40px;min-width:300px;max-width:500px;box-shadow:0 8px 32px rgba(0,0,0,0.3);text-align:center; }
.glass-popup-content h4 { margin:0 0 15px 0;font:800 18px/22px var(--inter);text-transform:uppercase;color:var(--bgInverse); }
.glass-popup-content p { margin:0 0 20px 0;font:var(--font);color:var(--bgInverse);line-height:1.6; }
.glass-popup-content .popup-icon { font-size:48px;margin-bottom:15px;display:block; }
.glass-popup-content .popup-button { background:linear-gradient(to right,var(--accent1),var(--accent2));color:var(--bg1);border:none;padding:12px 28px;border-radius:50px;font:800 12px/14px var(--inter);text-transform:uppercase;cursor:pointer;transition:opacity 0.3s; }
.glass-popup-content .popup-button:hover { opacity:0.9; }
.certificate-modal { position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);z-index:10001;display:none;width:95vw;max-width:1200px;max-height:95vh;overflow:hidden; }
.certificate-modal.show { display:block;animation:fadeInScale 0.3s ease-out; }
.certificate-modal-content { background:rgba(224,224,224,0.98);backdrop-filter:blur(20px);border:2px solid rgba(25,25,25,0.3);border-radius:20px;padding:20px;box-shadow:0 8px 32px rgba(0,0,0,0.3);position:relative;display:flex;flex-direction:column;max-height:95vh;overflow:hidden; }
.certificate-modal-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;padding-bottom:15px;border-bottom:2px solid rgba(25,25,25,0.2);flex-shrink:0; }
.certificate-modal-header h3 { margin:0;font:800 18px/22px var(--inter);text-transform:uppercase;color:var(--bgInverse); }
.certificate-modal-close { background:none;border:none;font-size:24px;cursor:pointer;color:var(--bgInverse);padding:0;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background 0.3s; }
.certificate-modal-close:hover { background:rgba(25,25,25,0.1); }
.certificate-preview { background:white;border:3px solid var(--bgInverse);border-radius:15px;padding:15px;width:100%;margin:0 auto;position:relative;overflow-y:auto;overflow-x:hidden;flex:1;min-height:0;max-height:calc(95vh - 180px);display:flex;justify-content:center;align-items:flex-start; }
.certificate-preview iframe { background:white;border:none;width:100%;max-width:1000px;min-height:650px;height:auto;display:block;transform:scale(1); }
.certificate-modal-actions { display:flex;gap:15px;justify-content:center;margin-top:15px;padding-top:15px;border-top:2px solid rgba(25,25,25,0.2);flex-shrink:0; }
.certificate-modal-actions button { background:linear-gradient(to right,var(--accent1),var(--accent2));color:var(--bg1);border:none;padding:12px 28px;border-radius:50px;font:800 12px/14px var(--inter);text-transform:uppercase;cursor:pointer;transition:opacity 0.3s; }
.certificate-modal-actions button:hover { opacity:0.9; }
.certificate-modal-actions button.secondary { background:var(--bgInverse);color:var(--bg1); }
.video-modal { position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);z-index:10001;display:none;width:95vw;max-width:1400px;max-height:95vh;overflow:hidden; }
.video-modal.show { display:block;animation:fadeInScale 0.3s ease-out; }
.video-modal-content { background:rgba(224,224,224,0.98);backdrop-filter:blur(20px);border:2px solid rgba(25,25,25,0.3);border-radius:20px;padding:20px;box-shadow:0 8px 32px rgba(0,0,0,0.3);position:relative;display:flex;flex-direction:column;max-height:95vh;overflow:hidden; }
.video-modal-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;padding-bottom:15px;border-bottom:2px solid rgba(25,25,25,0.2);flex-shrink:0; }
.video-modal-header h3 { margin:0;font:800 18px/22px var(--inter);text-transform:uppercase;color:var(--bgInverse); }
.video-modal-close { background:none;border:none;font-size:24px;cursor:pointer;color:var(--bgInverse);padding:0;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background 0.3s; }
.video-modal-close:hover { background:rgba(25,25,25,0.1); }
.video-preview { background:var(--bg1);border:3px solid var(--bgInverse);border-radius:15px;padding:0;width:100%;margin:0 auto;position:relative;overflow:hidden;flex:1;min-height:0;max-height:calc(95vh - 180px);display:flex;justify-content:center;align-items:center; }
.video-preview iframe { background:var(--bg1);border:none;width:100%;height:100%;min-height:600px;display:block; }
.video-modal-actions { display:flex;gap:15px;justify-content:center;margin-top:15px;padding-top:15px;border-top:2px solid rgba(25,25,25,0.2);flex-shrink:0; }
.video-modal-actions button { background:linear-gradient(to right,var(--accent1),var(--accent2));color:var(--bg1);border:none;padding:12px 28px;border-radius:50px;font:800 12px/14px var(--inter);text-transform:uppercase;cursor:pointer;transition:opacity 0.3s; }
.video-modal-actions button:hover { opacity:0.9; }
.video-modal-actions button.secondary { background:var(--bgInverse);color:var(--bg1); }
.podcast-modal { position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);z-index:10001;display:none;width:95vw;max-width:900px;max-height:95vh;overflow:hidden; }
.podcast-modal.show { display:block;animation:fadeInScale 0.3s ease-out; }
.podcast-modal-content { background:rgba(224,224,224,0.98);backdrop-filter:blur(20px);border:2px solid rgba(25,25,25,0.3);border-radius:20px;padding:20px;box-shadow:0 8px 32px rgba(0,0,0,0.3);position:relative;display:flex;flex-direction:column;max-height:95vh;overflow:hidden; }
.podcast-modal-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;padding-bottom:15px;border-bottom:2px solid rgba(25,25,25,0.2);flex-shrink:0; }
.podcast-modal-header h3 { margin:0;font:800 18px/22px var(--inter);text-transform:uppercase;color:var(--bgInverse); }
.podcast-modal-close { background:none;border:none;font-size:24px;cursor:pointer;color:var(--bgInverse);padding:0;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background 0.3s; }
.podcast-modal-close:hover { background:rgba(25,25,25,0.1); }
.podcast-preview { background:var(--bg1);border:3px solid var(--bgInverse);border-radius:15px;padding:0;width:100%;margin:0 auto;position:relative;overflow:hidden;flex:1;min-height:0;max-height:calc(95vh - 180px);display:flex;justify-content:center;align-items:center; }
.podcast-preview iframe { background:var(--bg1);border:none;width:100%;height:100%;min-height:400px;display:block; }
.podcast-modal-actions { display:flex;gap:15px;justify-content:center;margin-top:15px;padding-top:15px;border-top:2px solid rgba(25,25,25,0.2);flex-shrink:0; }
.podcast-modal-actions button { background:linear-gradient(to right,var(--accent1),var(--accent2));color:var(--bg1);border:none;padding:12px 28px;border-radius:50px;font:800 12px/14px var(--inter);text-transform:uppercase;cursor:pointer;transition:opacity 0.3s; }
.podcast-modal-actions button:hover { opacity:0.9; }
.podcast-modal-actions button.secondary { background:var(--bgInverse);color:var(--bg1); }
.bookmarks-dropdown { position:absolute;top:100%;right:0;margin-top:10px;background:rgba(224,224,224,0.98);backdrop-filter:blur(20px);border:2px solid rgba(25,25,25,0.3);border-radius:15px;box-shadow:0 8px 32px rgba(0,0,0,0.3);min-width:300px;max-width:400px;max-height:500px;overflow-y:auto;overflow-x:hidden;z-index:10002;display:none; }
.bookmarks-dropdown.show { display:block;animation:slideDown 0.3s ease-out; }
.bookmarks-dropdown-header { padding:15px 20px;border-bottom:2px solid rgba(25,25,25,0.2);display:flex;justify-content:space-between;align-items:center; }
.bookmarks-dropdown-header h4 { margin:0;font:800 14px/18px var(--inter);text-transform:uppercase;color:var(--bgInverse); }
.bookmarks-dropdown-close { background:none;border:none;font-size:20px;cursor:pointer;color:var(--bgInverse);padding:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background 0.3s; }
.bookmarks-dropdown-close:hover { background:rgba(25,25,25,0.1); }
.bookmarks-list { padding:10px 0;max-height:400px;overflow-y:auto; }
.bookmark-item { padding:12px 20px;border-bottom:1px solid rgba(25,25,25,0.1);cursor:pointer;transition:background 0.3s;display:flex;justify-content:space-between;align-items:center; }
.bookmark-item:hover { background:rgba(25,25,25,0.05); }
.bookmark-item:last-child { border-bottom:none; }
.bookmark-item-info { flex:1; }
.bookmark-item-title { font:800 12px/16px var(--inter);text-transform:uppercase;color:var(--bgInverse);margin:0 0 4px 0; }
.bookmark-item-stage { font:11px/14px var(--inter);color:var(--bg4);text-transform:uppercase;margin:0; }
.bookmark-item-remove { background:none;border:none;color:var(--bg4);cursor:pointer;padding:4px 8px;font-size:14px;border-radius:4px;transition:all 0.3s; }
.bookmark-item-remove:hover { background:rgba(255,0,0,0.1);color:#f44336; }
.bookmarks-empty { padding:30px 20px;text-align:center;color:var(--bg4);font:var(--font); }
.bookmarks-empty-icon { font-size:32px;margin-bottom:10px;display:block; }
@keyframes slideDown { from { opacity:0;transform:translateY(-10px); } to { opacity:1;transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes fadeInScale { from { opacity:0;transform:translate(-50%, -50%) scale(0.9); } to { opacity:1;transform:translate(-50%, -50%) scale(1); } }
.progress-checkpoint { background:var(--bg2);border-left:4px solid var(--accent1);border-radius:4px;padding:15px;margin:20px 0; }
.checkpoint-icon { display:inline-block;width:24px;height:24px;background:var(--accent1);color:var(--bg1);border-radius:50%;text-align:center;line-height:24px;font-weight:800;margin-right:10px; }
@media screen and (max-width: 1024px) { .birb-grid { grid-template-columns:70px 1fr; } .birb-sidebar { padding:20px 15px;width:70px; } .birb-sidebar-icon div { height:25px;width:25px; } .birb-sidebar-jump { height:32px;width:32px;font-size:16px; } .birb-sidebar-tog { padding:15px 10px;font-size:10px; } .birb-wrapper { padding:40px 30px; } .birb-banner-name { font-size:60px;line-height:1.1; } .page-card { grid-template-columns:1fr;gap:20px; } .birb-grid.usermenu .birb-user, .birb-grid.navmenu .birb-links, .birb-grid.popout2 .birb-popout { width:100%;max-width:400px; } .birb-user2, .birb-popout2, .birb-links2 { width:100%;padding:30px 25px; } }
@media screen and (max-width: 768px) { html, body { overflow-x:hidden; } .birb-grid { grid-template-columns:60px 1fr;min-height:auto; } .birb-sidebar { padding:15px 10px;width:60px;gap:10px;position:fixed;left:0;top:51px;height:calc(100vh - 51px);z-index:999; } .birb-sidebar-icon div { height:22px;width:22px; } .birb-sidebar-icon .progress-text { font-size:7px; } .birb-sidebar-jump { height:28px;width:28px;font-size:14px; } .birb-sidebar-tog { padding:12px 8px;font-size:9px; } .birb-sidebar-tog b { font-size:10px; } .birb-menu { padding:15px;flex-wrap:wrap;gap:10px; } .birb-menu a { font-size:10px; } .birb-nav { flex-wrap:wrap;gap:8px; } .birb-wrapper { padding:25px 20px; } .birb-banner-name { font-size:40px;line-height:1.2;padding:0 10px; } .birb-banner-img2 { height:180px; } .birb-banner-stuff { gap:30px;margin-top:30px;padding-bottom:40px; } .birb-banner-divide { margin:40px auto 80px auto;width:85%; } .course { padding:25px 20px;margin-bottom:20px; } .course .title { font-size:28px;line-height:1.2; } .course .sub { font-size:16px;line-height:1.4; } .course-nav { flex-wrap:wrap;gap:10px; } .course-nav button { padding:10px 18px;font-size:11px; } .content-area h3 { font-size:24px;line-height:1.3; } .content-area h4 { font-size:14px; } .page-card { grid-template-columns:1fr;gap:15px; } .side-card { padding:20px; } .btn { padding:12px 24px;font-size:11px; } .quiz-question { padding:15px;margin:20px 0; } .choice { padding:10px 16px;font-size:12px;margin:6px 6px 6px 0; } .birb-grid.usermenu .birb-user, .birb-grid.navmenu .birb-links, .birb-grid.popout2 .birb-popout { width:100%;max-width:100%;position:fixed;left:60px;top:51px;height:calc(100vh - 51px);z-index:998; } .birb-user2, .birb-popout2, .birb-links2 { width:100%;padding:25px 20px;height:calc(100vh - 51px); } .birb-user-name h1, .birb-user-name h2 { font-size:24px; } .birb-user-links { gap:10px;margin-bottom:15px; } .birb-user-links a { font-size:10px;padding-left:18px; } .birb-user-links a::before { font-size:24px; } }
@media screen and (max-width: 480px) { .birb-grid { grid-template-columns:50px 1fr; } .birb-sidebar { width:50px;padding:12px 8px;gap:8px; } .birb-sidebar-icon div { height:20px;width:20px; } .birb-sidebar-icon .progress-text { font-size:6px; } .birb-sidebar-jump { height:24px;width:24px;font-size:12px; } .birb-sidebar-tog { padding:10px 6px;font-size:8px; } .birb-sidebar-tog b { font-size:9px; } .birb-menu { padding:12px;gap:8px; } .birb-menu a { font-size:9px; } .birb-wrapper { padding:20px 15px; } .birb-banner-name { font-size:32px;line-height:1.1; } .birb-banner-img2 { height:150px; } .birb-banner-stuff { gap:20px;margin-top:20px;padding-bottom:30px; } .course { padding:20px 15px; } .course .title { font-size:22px; } .course .sub { font-size:14px; } .course-nav { gap:8px; } .course-nav button { padding:8px 14px;font-size:10px; } .content-area h3 { font-size:20px; } .content-area h4 { font-size:13px; } .content-area p, .content-area li { font-size:12px;line-height:1.5; } .btn { padding:10px 20px;font-size:10px; } .quiz-question { padding:12px; } .choice { padding:8px 12px;font-size:11px; } .birb-grid.usermenu .birb-user, .birb-grid.navmenu .birb-links, .birb-grid.popout2 .birb-popout { left:50px; } .birb-user2, .birb-popout2, .birb-links2 { padding:20px 15px; } .birb-user-name h1, .birb-user-name h2 { font-size:20px; } .birb-user-name2 { font-size:11px; } .birb-user-links a { font-size:9px;padding-left:15px; } .birb-user-links a::before { font-size:20px; } }
      
      /* Stage Images */
      .stage-image-container { margin: 20px 0; text-align: center; }
      .stage-main-image { max-width: 100%; height: auto; border-radius: 12px; border: 2px solid var(--border); margin-bottom: 10px; }
      .image-credit { font-size: 11px; color: var(--bgInverse); opacity: 0.7; margin: 5px 0 0 0; }
      .section-image { max-width: 100%; height: auto; margin: 20px 0; border-radius: 8px; border: 1px solid var(--border); }
      
      ${interactiveComponents.getComponentStyles()}
    `;
  }
}
