/**
 * Interactive Components Generator
 * Creates H5P-style interactive learning components
 */

export interface FillInTheBlanksData {
  text: string; // Text with blanks marked as {{blank}}
  blanks: Array<{ id: string; correctAnswer: string; options?: string[] }>;
  feedback?: { correct: string; incorrect: string };
}

export interface MatchColumnsData {
  leftColumn: Array<{ id: string; text: string }>;
  rightColumn: Array<{ id: string; text: string }>;
  matches: Array<{ leftId: string; rightId: string }>;
}

export interface DragDropData {
  items: Array<{ id: string; text: string; category?: string }>;
  dropZones: Array<{ id: string; label: string; accepts: string[] }>;
  correctMatches: Array<{ itemId: string; zoneId: string }>;
}

export interface ImageHotspotData {
  imageUrl: string;
  hotspots: Array<{
    id: string;
    x: number; // Percentage (0-100)
    y: number; // Percentage (0-100)
    title: string;
    description: string;
  }>;
}

export interface InteractiveVideoData {
  videoUrl: string;
  interactions: Array<{
    time: number; // Seconds
    type: 'question' | 'info' | 'link';
    content: any;
  }>;
}

export class InteractiveComponents {
  /**
   * Generate Fill-in-the-Blanks component HTML
   */
  generateFillInTheBlanks(data: FillInTheBlanksData): string {
    const blankId = `fill-blank-${Date.now()}`;
    const blanksHtml = data.blanks.map((blank, index) => {
      const inputId = `${blankId}-${index}`;
      const options = blank.options || [];
      
      if (options.length > 0) {
        // Dropdown style
        return `
          <select id="${inputId}" class="fill-blank-input" data-correct="${blank.correctAnswer}">
            <option value="">Select...</option>
            ${options.map(opt => `<option value="${this.escapeHtml(opt)}">${this.escapeHtml(opt)}</option>`).join('')}
          </select>
        `;
      } else {
        // Text input style
        return `
          <input type="text" id="${inputId}" class="fill-blank-input" 
                 data-correct="${this.escapeHtml(blank.correctAnswer)}" 
                 placeholder="Fill in the blank">
        `;
      }
    }).join('');

    // Replace {{blank}} placeholders with actual inputs
    let textWithBlanks = data.text;
    let blankIndex = 0;
    textWithBlanks = textWithBlanks.replace(/\{\{blank\}\}/g, () => {
      const input = data.blanks[blankIndex] ? blanksHtml.split('</select>').join('</select>').split('</input>').join('</input>').split(`fill-blank-${blankIndex}`)[0] : '';
      blankIndex++;
      return input || '{{blank}}';
    });

    // Rebuild properly
    const parts = data.text.split(/\{\{blank\}\}/);
    let finalHtml = '';
    for (let i = 0; i < parts.length; i++) {
      finalHtml += this.escapeHtml(parts[i]);
      if (i < data.blanks.length) {
        const blank = data.blanks[i];
        const inputId = `${blankId}-${i}`;
        const options = blank.options || [];
        
        if (options.length > 0) {
          finalHtml += `
            <select id="${inputId}" class="fill-blank-input" data-correct="${this.escapeHtml(blank.correctAnswer)}">
              <option value="">Select...</option>
              ${options.map(opt => `<option value="${this.escapeHtml(opt)}">${this.escapeHtml(opt)}</option>`).join('')}
            </select>
          `;
        } else {
          finalHtml += `
            <input type="text" id="${inputId}" class="fill-blank-input" 
                   data-correct="${this.escapeHtml(blank.correctAnswer)}" 
                   placeholder="Fill in the blank">
          `;
        }
      }
    }

    return `
      <div class="interactive-component fill-blanks" data-component-id="${blankId}">
        <div class="fill-blanks-text">${finalHtml}</div>
        <button type="button" class="btn check-answer-btn" onclick="checkFillBlanks('${blankId}')">Check Answer</button>
        <div class="feedback-message" id="${blankId}-feedback"></div>
      </div>
      <script>
        function checkFillBlanks(componentId) {
          const component = document.querySelector(\`[data-component-id="\${componentId}"]\`);
          const inputs = component.querySelectorAll('.fill-blank-input');
          let allCorrect = true;
          let correctCount = 0;
          
          inputs.forEach(input => {
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = input.getAttribute('data-correct').toLowerCase();
            const isCorrect = userAnswer === correctAnswer;
            
            if (isCorrect) {
              input.classList.add('correct');
              input.classList.remove('incorrect');
              correctCount++;
            } else {
              input.classList.add('incorrect');
              input.classList.remove('correct');
              allCorrect = false;
            }
          });
          
          const feedbackEl = document.getElementById(\`\${componentId}-feedback\`);
          if (allCorrect) {
            feedbackEl.innerHTML = '<div class="feedback-correct">✓ All correct! Great job!</div>';
            feedbackEl.className = 'feedback-message feedback-correct';
          } else {
            feedbackEl.innerHTML = \`<div class="feedback-incorrect">You got \${correctCount} out of \${inputs.length} correct. Try again!</div>\`;
            feedbackEl.className = 'feedback-message feedback-incorrect';
          }
        }
      </script>
    `;
  }

  /**
   * Generate Match the Columns component HTML
   */
  generateMatchColumns(data: MatchColumnsData): string {
    const componentId = `match-columns-${Date.now()}`;
    
    const leftHtml = data.leftColumn.map(item => `
      <div class="match-item" data-id="${item.id}" data-side="left" draggable="true">
        ${this.escapeHtml(item.text)}
      </div>
    `).join('');

    const rightHtml = data.rightColumn.map(item => `
      <div class="match-item" data-id="${item.id}" data-side="right" data-drop-zone="true">
        ${this.escapeHtml(item.text)}
      </div>
    `).join('');

    // Create matches map for validation
    const matchesJson = JSON.stringify(data.matches);

    return `
      <div class="interactive-component match-columns" data-component-id="${componentId}">
        <div class="match-columns-container">
          <div class="match-column left-column">
            <h5>Column A</h5>
            ${leftHtml}
          </div>
          <div class="match-column right-column">
            <h5>Column B</h5>
            ${rightHtml}
          </div>
        </div>
        <button type="button" class="btn check-answer-btn" onclick="checkMatchColumns('${componentId}')">Check Matches</button>
        <div class="feedback-message" id="${componentId}-feedback"></div>
      </div>
      <script>
        (function() {
          const componentId = '${componentId}';
          const correctMatches = ${matchesJson};
          let userMatches = [];
          
          // Drag and drop functionality
          const leftItems = document.querySelectorAll(\`[data-component-id="\${componentId}"] .left-column .match-item\`);
          const rightItems = document.querySelectorAll(\`[data-component-id="\${componentId}"] .right-column .match-item\`);
          
          leftItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
              e.dataTransfer.setData('text/plain', item.getAttribute('data-id'));
              item.classList.add('dragging');
            });
            
            item.addEventListener('dragend', () => {
              item.classList.remove('dragging');
            });
          });
          
          rightItems.forEach(dropZone => {
            dropZone.addEventListener('dragover', (e) => {
              e.preventDefault();
              dropZone.classList.add('drag-over');
            });
            
            dropZone.addEventListener('dragleave', () => {
              dropZone.classList.remove('drag-over');
            });
            
            dropZone.addEventListener('drop', (e) => {
              e.preventDefault();
              dropZone.classList.remove('drag-over');
              const leftId = e.dataTransfer.getData('text/plain');
              const rightId = dropZone.getAttribute('data-id');
              
              // Store match
              userMatches = userMatches.filter(m => m.leftId !== leftId);
              userMatches.push({ leftId, rightId });
              
              // Visual feedback
              const leftItem = document.querySelector(\`[data-component-id="\${componentId}"] .left-column [data-id="\${leftId}"]\`);
              if (leftItem) {
                leftItem.classList.add('matched');
                dropZone.classList.add('matched');
              }
            });
          });
          
          window.checkMatchColumns = function(id) {
            if (id !== componentId) return;
            
            let correctCount = 0;
            const totalMatches = correctMatches.length;
            
            correctMatches.forEach(correct => {
              const userMatch = userMatches.find(m => m.leftId === correct.leftId);
              if (userMatch && userMatch.rightId === correct.rightId) {
                correctCount++;
              }
            });
            
            const feedbackEl = document.getElementById(\`\${componentId}-feedback\`);
            if (correctCount === totalMatches) {
              feedbackEl.innerHTML = '<div class="feedback-correct">✓ Perfect! All matches are correct!</div>';
              feedbackEl.className = 'feedback-message feedback-correct';
            } else {
              feedbackEl.innerHTML = \`<div class="feedback-incorrect">You matched \${correctCount} out of \${totalMatches} correctly. Try again!</div>\`;
              feedbackEl.className = 'feedback-message feedback-incorrect';
            }
          };
        })();
      </script>
    `;
  }

  /**
   * Generate Drag and Drop component HTML
   */
  generateDragDrop(data: DragDropData): string {
    const componentId = `drag-drop-${Date.now()}`;
    
    const itemsHtml = data.items.map(item => `
      <div class="drag-item" data-id="${item.id}" draggable="true">
        ${this.escapeHtml(item.text)}
      </div>
    `).join('');

    const zonesHtml = data.dropZones.map(zone => `
      <div class="drop-zone" data-id="${zone.id}" data-accepts="${zone.accepts.join(',')}">
        <div class="drop-zone-label">${this.escapeHtml(zone.label)}</div>
        <div class="drop-zone-content"></div>
      </div>
    `).join('');

    const correctMatchesJson = JSON.stringify(data.correctMatches);

    return `
      <div class="interactive-component drag-drop" data-component-id="${componentId}">
        <div class="drag-drop-container">
          <div class="drag-zone">
            <h5>Drag items here:</h5>
            ${itemsHtml}
          </div>
          <div class="drop-zones-container">
            ${zonesHtml}
          </div>
        </div>
        <button type="button" class="btn check-answer-btn" onclick="checkDragDrop('${componentId}')">Check Answer</button>
        <div class="feedback-message" id="${componentId}-feedback"></div>
      </div>
      <script>
        (function() {
          const componentId = '${componentId}';
          const correctMatches = ${correctMatchesJson};
          let userMatches = [];
          
          const dragItems = document.querySelectorAll(\`[data-component-id="\${componentId}"] .drag-item\`);
          const dropZones = document.querySelectorAll(\`[data-component-id="\${componentId}"] .drop-zone\`);
          
          dragItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
              e.dataTransfer.setData('text/plain', item.getAttribute('data-id'));
              item.classList.add('dragging');
            });
            
            item.addEventListener('dragend', () => {
              item.classList.remove('dragging');
            });
          });
          
          dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
              e.preventDefault();
              zone.classList.add('drag-over');
            });
            
            zone.addEventListener('dragleave', () => {
              zone.classList.remove('drag-over');
            });
            
            zone.addEventListener('drop', (e) => {
              e.preventDefault();
              zone.classList.remove('drag-over');
              const itemId = e.dataTransfer.getData('text/plain');
              const accepts = zone.getAttribute('data-accepts').split(',');
              
              if (accepts.includes(itemId)) {
                const item = document.querySelector(\`[data-component-id="\${componentId}"] .drag-item[data-id="\${itemId}"]\`);
                const content = zone.querySelector('.drop-zone-content');
                
                if (item && content) {
                  // Remove from previous zone if any
                  const prevZone = item.closest('.drop-zone');
                  if (prevZone && prevZone !== zone) {
                    prevZone.querySelector('.drop-zone-content').innerHTML = '';
                  }
                  
                  content.appendChild(item);
                  item.classList.add('dropped');
                  
                  // Store match
                  userMatches = userMatches.filter(m => m.itemId !== itemId);
                  userMatches.push({ itemId, zoneId: zone.getAttribute('data-id') });
                }
              }
            });
          });
          
          window.checkDragDrop = function(id) {
            if (id !== componentId) return;
            
            let correctCount = 0;
            const totalMatches = correctMatches.length;
            
            correctMatches.forEach(correct => {
              const userMatch = userMatches.find(m => m.itemId === correct.itemId);
              if (userMatch && userMatch.zoneId === correct.zoneId) {
                correctCount++;
                const item = document.querySelector(\`[data-component-id="\${componentId}"] .drag-item[data-id="\${correct.itemId}"]\`);
                const zone = document.querySelector(\`[data-component-id="\${componentId}"] .drop-zone[data-id="\${correct.zoneId}"]\`);
                if (item) item.classList.add('correct-match');
                if (zone) zone.classList.add('correct-match');
              } else {
                const item = document.querySelector(\`[data-component-id="\${componentId}"] .drag-item[data-id="\${correct.itemId}"]\`);
                if (item) item.classList.add('incorrect-match');
              }
            });
            
            const feedbackEl = document.getElementById(\`\${componentId}-feedback\`);
            if (correctCount === totalMatches) {
              feedbackEl.innerHTML = '<div class="feedback-correct">✓ Excellent! All items are in the correct place!</div>';
              feedbackEl.className = 'feedback-message feedback-correct';
            } else {
              feedbackEl.innerHTML = \`<div class="feedback-incorrect">You placed \${correctCount} out of \${totalMatches} items correctly. Try again!</div>\`;
              feedbackEl.className = 'feedback-message feedback-incorrect';
            }
          };
        })();
      </script>
    `;
  }

  /**
   * Generate Image Hotspots component HTML
   */
  generateImageHotspots(data: ImageHotspotData): string {
    const componentId = `image-hotspots-${Date.now()}`;
    
    const hotspotsHtml = data.hotspots.map(hotspot => `
      <div class="hotspot" 
           style="left: ${hotspot.x}%; top: ${hotspot.y}%;"
           data-hotspot-id="${hotspot.id}"
           onclick="toggleHotspot('${componentId}', '${hotspot.id}')">
        <div class="hotspot-marker"></div>
        <div class="hotspot-tooltip" id="${componentId}-tooltip-${hotspot.id}">
          <h6>${this.escapeHtml(hotspot.title)}</h6>
          <p>${this.escapeHtml(hotspot.description)}</p>
        </div>
      </div>
    `).join('');

    return `
      <div class="interactive-component image-hotspots" data-component-id="${componentId}">
        <div class="hotspot-image-container">
          <img src="${this.escapeHtml(data.imageUrl)}" alt="Interactive image" class="hotspot-image">
          ${hotspotsHtml}
        </div>
      </div>
      <script>
        function toggleHotspot(componentId, hotspotId) {
          const tooltip = document.getElementById(\`\${componentId}-tooltip-\${hotspotId}\`);
          const allTooltips = document.querySelectorAll(\`[data-component-id="\${componentId}"] .hotspot-tooltip\`);
          
          // Close all other tooltips
          allTooltips.forEach(t => {
            if (t !== tooltip) t.classList.remove('active');
          });
          
          // Toggle current tooltip
          if (tooltip) {
            tooltip.classList.toggle('active');
          }
        }
        
        // Close tooltips when clicking outside
        document.addEventListener('click', (e) => {
          if (!e.target.closest('.hotspot')) {
            document.querySelectorAll('.hotspot-tooltip').forEach(t => t.classList.remove('active'));
          }
        });
      </script>
    `;
  }

  /**
   * Generate Interactive Video component HTML
   */
  generateInteractiveVideo(data: InteractiveVideoData): string {
    const componentId = `interactive-video-${Date.now()}`;
    
    const interactionsJson = JSON.stringify(data.interactions);

    return `
      <div class="interactive-component interactive-video" data-component-id="${componentId}">
        <div class="video-wrapper">
          <video id="${componentId}-video" controls>
            <source src="${this.escapeHtml(data.videoUrl)}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          <div class="video-interactions-overlay" id="${componentId}-overlay"></div>
        </div>
      </div>
      <script>
        (function() {
          const componentId = '${componentId}';
          const interactions = ${interactionsJson};
          const video = document.getElementById(\`\${componentId}-video\`);
          const overlay = document.getElementById(\`\${componentId}-overlay\`);
          
          if (video && overlay) {
            video.addEventListener('timeupdate', () => {
              const currentTime = video.currentTime;
              interactions.forEach(interaction => {
                if (currentTime >= interaction.time && currentTime < interaction.time + 2) {
                  showInteraction(componentId, interaction);
                }
              });
            });
          }
          
          function showInteraction(componentId, interaction) {
            const overlay = document.getElementById(\`\${componentId}-overlay\`);
            if (!overlay) return;
            
            let content = '';
            if (interaction.type === 'question') {
              content = \`
                <div class="video-interaction question">
                  <h6>\${interaction.content.question}</h6>
                  <div class="question-options">
                    \${interaction.content.options.map((opt, i) => 
                      \`<button class="option-btn" onclick="handleVideoQuestion('\${componentId}', '\${interaction.content.correct}', '\${opt}')">\${opt}</button>\`
                    ).join('')}
                  </div>
                </div>
              \`;
            } else if (interaction.type === 'info') {
              content = \`
                <div class="video-interaction info">
                  <h6>\${interaction.content.title}</h6>
                  <p>\${interaction.content.text}</p>
                  <button onclick="closeVideoInteraction('\${componentId}')">Continue</button>
                </div>
              \`;
            }
            
            overlay.innerHTML = content;
            overlay.classList.add('active');
          }
          
          window.handleVideoQuestion = function(componentId, correct, selected) {
            const overlay = document.getElementById(\`\${componentId}-overlay\`);
            if (selected === correct) {
              overlay.innerHTML = '<div class="video-interaction feedback correct">✓ Correct! Well done!</div>';
            } else {
              overlay.innerHTML = '<div class="video-interaction feedback incorrect">✗ Not quite. The correct answer is: ' + correct + '</div>';
            }
            setTimeout(() => {
              closeVideoInteraction(componentId);
            }, 2000);
          };
          
          window.closeVideoInteraction = function(componentId) {
            const overlay = document.getElementById(\`\${componentId}-overlay\`);
            if (overlay) {
              overlay.classList.remove('active');
              overlay.innerHTML = '';
            }
          };
        })();
      </script>
    `;
  }

  /**
   * Generate Timeline/Sequence component HTML
   */
  generateTimeline(items: Array<{ id: string; title: string; description: string; order: number }>): string {
    const componentId = `timeline-${Date.now()}`;
    const sortedItems = [...items].sort((a, b) => a.order - b.order);
    
    const itemsHtml = sortedItems.map((item, index) => `
      <div class="timeline-item" data-id="${item.id}" data-order="${item.order}">
        <div class="timeline-marker">${index + 1}</div>
        <div class="timeline-content">
          <h6>${this.escapeHtml(item.title)}</h6>
          <p>${this.escapeHtml(item.description)}</p>
        </div>
      </div>
    `).join('');

    return `
      <div class="interactive-component timeline" data-component-id="${componentId}">
        <div class="timeline-container">
          ${itemsHtml}
        </div>
      </div>
    `;
  }

  /**
   * Generate Memory Cards/Flashcards component HTML
   */
  generateMemoryCards(cards: Array<{ id: string; front: string; back: string }>): string {
    const componentId = `memory-cards-${Date.now()}`;
    
    const cardsHtml = cards.map(card => `
      <div class="memory-card" data-id="${card.id}" onclick="flipCard('${componentId}', '${card.id}')">
        <div class="card-front">
          ${this.escapeHtml(card.front)}
        </div>
        <div class="card-back">
          ${this.escapeHtml(card.back)}
        </div>
      </div>
    `).join('');

    return `
      <div class="interactive-component memory-cards" data-component-id="${componentId}">
        <div class="memory-cards-grid">
          ${cardsHtml}
        </div>
      </div>
      <script>
        function flipCard(componentId, cardId) {
          const card = document.querySelector(\`[data-component-id="\${componentId}"] .memory-card[data-id="\${cardId}"]\`);
          if (card) {
            card.classList.toggle('flipped');
          }
        }
      </script>
    `;
  }

  /**
   * Get CSS styles for all interactive components
   */
  getComponentStyles(): string {
    return `
      /* Fill in the Blanks */
      .fill-blanks-text {
        font-size: 1.1rem;
        line-height: 1.8;
        margin: 20px 0;
      }
      .fill-blank-input {
        display: inline-block;
        min-width: 150px;
        padding: 8px 12px;
        margin: 0 5px;
        border: 2px solid var(--border);
        border-radius: 6px;
        font-size: 1rem;
        background: var(--bg1);
        color: var(--bgInverse);
      }
      .fill-blank-input.correct {
        border-color: #4caf50;
        background: #e8f5e9;
      }
      .fill-blank-input.incorrect {
        border-color: #f44336;
        background: #ffebee;
      }
      
      /* Match Columns */
      .match-columns-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin: 20px 0;
      }
      .match-column h5 {
        margin-bottom: 15px;
        font: 800 14px/18px var(--inter);
        text-transform: uppercase;
        color: var(--bgInverse);
      }
      .match-item {
        padding: 12px 16px;
        margin: 8px 0;
        background: var(--bg2);
        border: 2px solid var(--border);
        border-radius: 8px;
        cursor: move;
        transition: all 0.3s;
      }
      .match-item.dragging {
        opacity: 0.5;
      }
      .match-item.drag-over {
        border-color: var(--accent1);
        background: var(--bg3);
      }
      .match-item.matched {
        background: #e8f5e9;
        border-color: #4caf50;
      }
      
      /* Drag and Drop */
      .drag-drop-container {
        display: flex;
        gap: 20px;
        margin: 20px 0;
      }
      .drag-zone {
        flex: 1;
        min-height: 200px;
        padding: 15px;
        background: var(--bg2);
        border: 2px dashed var(--border);
        border-radius: 8px;
      }
      .drag-item {
        display: inline-block;
        padding: 10px 16px;
        margin: 8px;
        background: var(--bg1);
        border: 2px solid var(--border);
        border-radius: 6px;
        cursor: move;
        transition: all 0.3s;
      }
      .drag-item.dragging {
        opacity: 0.5;
      }
      .drop-zones-container {
        flex: 2;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }
      .drop-zone {
        min-height: 150px;
        padding: 15px;
        background: var(--bg2);
        border: 2px dashed var(--border);
        border-radius: 8px;
        transition: all 0.3s;
      }
      .drop-zone.drag-over {
        border-color: var(--accent1);
        background: var(--bg3);
      }
      .drop-zone.correct-match {
        border-color: #4caf50;
        background: #e8f5e9;
      }
      .drop-zone-label {
        font: 800 12px/16px var(--inter);
        text-transform: uppercase;
        margin-bottom: 10px;
        color: var(--bgInverse);
      }
      .drag-item.dropped {
        margin: 5px 0;
      }
      .drag-item.correct-match {
        background: #e8f5e9;
        border-color: #4caf50;
      }
      .drag-item.incorrect-match {
        background: #ffebee;
        border-color: #f44336;
      }
      
      /* Image Hotspots */
      .hotspot-image-container {
        position: relative;
        display: inline-block;
        width: 100%;
        max-width: 800px;
        margin: 20px 0;
      }
      .hotspot-image {
        width: 100%;
        height: auto;
        display: block;
      }
      .hotspot {
        position: absolute;
        cursor: pointer;
        transform: translate(-50%, -50%);
      }
      .hotspot-marker {
        width: 24px;
        height: 24px;
        background: var(--accent1);
        border: 3px solid var(--bg1);
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      .hotspot-tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-10px);
        min-width: 200px;
        max-width: 300px;
        padding: 15px;
        background: var(--bg1);
        border: 2px solid var(--border);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s;
        z-index: 1000;
      }
      .hotspot-tooltip.active {
        opacity: 1;
        pointer-events: auto;
        transform: translateX(-50%) translateY(-5px);
      }
      .hotspot-tooltip h6 {
        margin: 0 0 8px 0;
        font: 800 14px/18px var(--inter);
        color: var(--bgInverse);
      }
      .hotspot-tooltip p {
        margin: 0;
        font: var(--font);
        color: var(--bgInverse);
        opacity: 0.9;
      }
      
      /* Interactive Video */
      .video-wrapper {
        position: relative;
        width: 100%;
        max-width: 800px;
        margin: 20px 0;
      }
      .video-wrapper video {
        width: 100%;
        height: auto;
        display: block;
      }
      .video-interactions-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10;
      }
      .video-interactions-overlay.active {
        display: flex;
      }
      .video-interaction {
        background: var(--bg1);
        border: 2px solid var(--border);
        border-radius: 12px;
        padding: 25px;
        max-width: 500px;
        text-align: center;
      }
      .video-interaction h6 {
        margin: 0 0 15px 0;
        font: 800 16px/20px var(--inter);
        color: var(--bgInverse);
      }
      .question-options {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .option-btn {
        padding: 12px 20px;
        background: var(--bg2);
        border: 2px solid var(--border);
        border-radius: 8px;
        cursor: pointer;
        font: var(--font);
        color: var(--bgInverse);
        transition: all 0.3s;
      }
      .option-btn:hover {
        background: var(--bg3);
      }
      .video-interaction.feedback.correct {
        border-color: #4caf50;
        background: #e8f5e9;
      }
      .video-interaction.feedback.incorrect {
        border-color: #f44336;
        background: #ffebee;
      }
      
      /* Timeline */
      .timeline-container {
        position: relative;
        padding: 20px 0;
        margin: 20px 0;
      }
      .timeline-container::before {
        content: '';
        position: absolute;
        left: 30px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--border);
      }
      .timeline-item {
        position: relative;
        padding-left: 70px;
        margin-bottom: 30px;
      }
      .timeline-marker {
        position: absolute;
        left: 0;
        top: 0;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, var(--accent1), var(--accent2));
        border: 3px solid var(--bg1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font: 800 20px/24px var(--inter);
        color: var(--bg1);
        z-index: 1;
      }
      .timeline-content {
        background: var(--bg2);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 15px;
      }
      .timeline-content h6 {
        margin: 0 0 8px 0;
        font: 800 14px/18px var(--inter);
        color: var(--bgInverse);
      }
      .timeline-content p {
        margin: 0;
        font: var(--font);
        color: var(--bgInverse);
        opacity: 0.9;
      }
      
      /* Memory Cards */
      .memory-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        margin: 20px 0;
      }
      .memory-card {
        position: relative;
        height: 200px;
        perspective: 1000px;
        cursor: pointer;
      }
      .card-front, .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border: 2px solid var(--border);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        transition: transform 0.6s;
        background: var(--bg2);
      }
      .card-front {
        background: linear-gradient(135deg, var(--accent1), var(--accent2));
        color: var(--bg1);
        font: 800 16px/20px var(--inter);
      }
      .card-back {
        transform: rotateY(180deg);
        background: var(--bg1);
        color: var(--bgInverse);
        font: var(--font);
      }
      .memory-card.flipped .card-front {
        transform: rotateY(180deg);
      }
      .memory-card.flipped .card-back {
        transform: rotateY(0deg);
      }
      
      /* Feedback Messages */
      .feedback-message {
        margin-top: 15px;
        padding: 12px 16px;
        border-radius: 8px;
        font: var(--font);
      }
      .feedback-correct {
        background: #e8f5e9;
        border: 2px solid #4caf50;
        color: #2e7d32;
      }
      .feedback-incorrect {
        background: #ffebee;
        border: 2px solid #f44336;
        color: #c62828;
      }
      .check-answer-btn {
        margin-top: 15px;
      }
    `;
  }

  private escapeHtml(text: string): string {
    const div = { innerHTML: '' } as any;
    div.textContent = text;
    return div.innerHTML || text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

export const interactiveComponents = new InteractiveComponents();
