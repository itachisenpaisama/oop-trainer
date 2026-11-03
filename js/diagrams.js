/**
 * Python OOP & UML Trainer - Interactive SVG Diagram Engine
 * Renders interactive UML Classes, Relationships, Use-Cases, and RAM Pointer Models.
 */
(function() {
  class DiagramEngine {
    constructor() {}

    /**
     * Renders an interactive UML Class Diagram Box with clickable hotspots
     * (e.g. click on private attribute, static method, derived attribute)
     */
    renderClassDiagram(config) {
      // config: { className, attributes: [{text, id, isTarget}], methods: [{text, id, isTarget}], isAbstract, isStatic }
      const width = config.width || 340;
      const rowHeight = 24;
      const headerHeight = 36;
      const attrCount = config.attributes ? config.attributes.length : 0;
      const methodCount = config.methods ? config.methods.length : 0;
      const attrHeight = Math.max(26, attrCount * rowHeight + 10);
      const methodHeight = Math.max(26, methodCount * rowHeight + 10);
      const totalHeight = headerHeight + attrHeight + methodHeight;

      let svg = `<svg viewBox="0 0 ${width} ${totalHeight + 10}" class="w-full max-w-md mx-auto select-none" xmlns="http://www.w3.org/2000/svg">`;
      
      // Card background & borders
      svg += `
        <defs>
          <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="115%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
          </filter>
        </defs>
        <rect x="5" y="5" width="${width - 10}" height="${totalHeight}" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2" filter="url(#card-shadow)"/>
      `;

      // Header (Class Name)
      const isItalic = config.isAbstract ? 'font-style="italic"' : '';
      svg += `
        <rect x="5" y="5" width="${width - 10}" height="${headerHeight}" rx="10" fill="#1e293b"/>
        <rect x="5" y="${headerHeight - 2}" width="${width - 10}" height="7" fill="#1e293b"/>
        <line x1="5" y1="${headerHeight + 5}" x2="${width - 5}" y2="${headerHeight + 5}" stroke="#334155" stroke-width="2"/>
        <text x="${width / 2}" y="28" text-anchor="middle" fill="#f8fafc" font-family="ui-monospace, monospace" font-size="14" font-weight="bold" ${isItalic}>
          ${config.className}
        </text>
      `;

      // Attributes Section
      let currentY = headerHeight + 5;
      if (config.attributes && config.attributes.length > 0) {
        config.attributes.forEach((attr, idx) => {
          const y = currentY + 18 + (idx * rowHeight);
          const isUnderline = attr.isStatic ? 'text-decoration="underline"' : '';
          svg += `
            <g class="diagram-hotspot cursor-pointer group" data-hotspot-id="${attr.id || 'attr_' + idx}">
              <rect x="10" y="${y - 14}" width="${width - 20}" height="${rowHeight - 2}" rx="4" fill="transparent" class="group-hover:fill-slate-800/60 transition"/>
              <text x="18" y="${y}" fill="#94a3b8" font-family="ui-monospace, monospace" font-size="12" ${isUnderline} class="group-hover:fill-sky-300">
                ${this.escape(attr.text)}
              </text>
            </g>
          `;
        });
      } else {
        svg += `<text x="18" y="${currentY + 18}" fill="#475569" font-family="ui-monospace, monospace" font-size="11" font-style="italic">keine Attribute</text>`;
      }

      currentY += attrHeight;
      // Divider line
      svg += `<line x1="5" y1="${currentY}" x2="${width - 5}" y2="${currentY}" stroke="#334155" stroke-width="2"/>`;

      // Methods Section
      if (config.methods && config.methods.length > 0) {
        config.methods.forEach((meth, idx) => {
          const y = currentY + 18 + (idx * rowHeight);
          const isUnderline = meth.isStatic ? 'text-decoration="underline"' : '';
          svg += `
            <g class="diagram-hotspot cursor-pointer group" data-hotspot-id="${meth.id || 'meth_' + idx}">
              <rect x="10" y="${y - 14}" width="${width - 20}" height="${rowHeight - 2}" rx="4" fill="transparent" class="group-hover:fill-slate-800/60 transition"/>
              <text x="18" y="${y}" fill="#38bdf8" font-family="ui-monospace, monospace" font-size="12" ${isUnderline} class="group-hover:fill-brand-400">
                ${this.escape(meth.text)}
              </text>
            </g>
          `;
        });
      } else {
        svg += `<text x="18" y="${currentY + 18}" fill="#475569" font-family="ui-monospace, monospace" font-size="11" font-style="italic">keine Operationen</text>`;
      }

      svg += `</svg>`;
      return svg;
    }

    /**
     * Renders RAM Memory Pointer Model (Stack vs Heap)
     * Demonstrating references, aliasing, and how 'self' binds to heap instances.
     */
    renderMemoryPointerModel(config) {
      // config: { stackVars: [{ name, pointsToId, id }], heapObjects: [{ id, label, attrs: [] }], activeCall: str }
      const width = 520;
      const height = 240;

      let svg = `<svg viewBox="0 0 ${width} ${height}" class="w-full max-w-xl mx-auto select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
          </marker>
          <marker id="arrow-self" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#22c55e"/>
          </marker>
        </defs>

        <!-- Stack Column (Left) -->
        <rect x="15" y="15" width="160" height="210" rx="10" fill="#0b1120" stroke="#334155" stroke-width="1.5"/>
        <text x="95" y="38" text-anchor="middle" fill="#94a3b8" font-family="ui-monospace, monospace" font-size="12" font-weight="bold">
          STACK (Referenzen)
        </text>
        <line x1="15" y1="48" x2="175" y2="48" stroke="#1e293b" stroke-width="1.5"/>

        <!-- Heap Column (Right) -->
        <rect x="300" y="15" width="205" height="210" rx="10" fill="#0b1120" stroke="#334155" stroke-width="1.5"/>
        <text x="402" y="38" text-anchor="middle" fill="#94a3b8" font-family="ui-monospace, monospace" font-size="12" font-weight="bold">
          HEAP (Objekte im RAM)
        </text>
        <line x1="300" y1="48" x2="505" y2="48" stroke="#1e293b" stroke-width="1.5"/>
      `;

      // Render Stack Variables
      const stackPositions = {};
      config.stackVars.forEach((v, idx) => {
        const y = 75 + (idx * 48);
        stackPositions[v.id] = { x: 165, y: y + 10 };
        svg += `
          <g class="diagram-hotspot cursor-pointer" data-hotspot-id="${v.id}">
            <rect x="25" y="${y - 12}" width="140" height="34" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1"/>
            <text x="35" y="${y + 10}" fill="#f8fafc" font-family="ui-monospace, monospace" font-size="12" font-weight="bold">
              ${v.name}
            </text>
            <circle cx="150" cy="${y + 5}" r="4" fill="#38bdf8"/>
          </g>
        `;
      });

      // Render Heap Objects
      const heapPositions = {};
      config.heapObjects.forEach((obj, idx) => {
        const y = 65 + (idx * 75);
        heapPositions[obj.id] = { x: 310, y: y + 25 };
        svg += `
          <g class="diagram-hotspot cursor-pointer" data-hotspot-id="${obj.id}">
            <rect x="310" y="${y - 8}" width="185" height="58" rx="8" fill="#1b2336" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="320" y="${y + 12}" fill="#38bdf8" font-family="ui-monospace, monospace" font-size="12" font-weight="bold">
              ${obj.label}
            </text>
            <text x="320" y="${y + 32}" fill="#94a3b8" font-family="ui-monospace, monospace" font-size="11">
              ${obj.attrs ? obj.attrs.join(', ') : ''}
            </text>
          </g>
        `;
      });

      // Render Arrows
      config.stackVars.forEach(v => {
        if (v.pointsToId && heapPositions[v.pointsToId] && stackPositions[v.id]) {
          const from = stackPositions[v.id];
          const to = heapPositions[v.pointsToId];
          const isSelf = v.name === 'self';
          const stroke = isSelf ? '#22c55e' : '#38bdf8';
          const marker = isSelf ? 'url(#arrow-self)' : 'url(#arrow)';
          
          svg += `
            <path d="M ${from.x} ${from.y} C ${from.x + 60} ${from.y}, ${to.x - 60} ${to.y}, ${to.x} ${to.y}" 
                  fill="none" stroke="${stroke}" stroke-width="2" marker-end="${marker}"/>
          `;
        }
      });

      svg += `</svg>`;
      return svg;
    }

    /**
     * Renders UML Relationship Diagram with interactive connection slots or choices
     * (Association, Aggregation, Composition, Generalization)
     */
    renderRelationshipDiagram(config) {
      // config: { classA: str, classB: str, currentSymbol: 'composition' | 'aggregation' | 'generalization' | 'association' | 'empty' }
      const width = 480;
      const height = 150;

      let symbolSvg = '';
      if (config.currentSymbol === 'composition') {
        // Solid black diamond at classA
        symbolSvg = `
          <polygon points="175,75 187,69 199,75 187,81" fill="#f8fafc" stroke="#f8fafc" stroke-width="1.5"/>
          <line x1="199" y1="75" x2="305" y2="75" stroke="#f8fafc" stroke-width="2"/>
        `;
      } else if (config.currentSymbol === 'aggregation') {
        // Hollow white diamond at classA
        symbolSvg = `
          <polygon points="175,75 187,69 199,75 187,81" fill="#0f172a" stroke="#f8fafc" stroke-width="2"/>
          <line x1="199" y1="75" x2="305" y2="75" stroke="#f8fafc" stroke-width="2"/>
        `;
      } else if (config.currentSymbol === 'generalization') {
        // Hollow triangle arrow pointing to classA (Superclass)
        symbolSvg = `
          <polygon points="175,75 190,67 190,83" fill="#0f172a" stroke="#f8fafc" stroke-width="2"/>
          <line x1="190" y1="75" x2="305" y2="75" stroke="#f8fafc" stroke-width="2"/>
        `;
      } else if (config.currentSymbol === 'empty') {
        // Drop zone or dashed line
        symbolSvg = `
          <line x1="175" y1="75" x2="305" y2="75" stroke="#475569" stroke-width="2" stroke-dasharray="4"/>
          <rect x="220" y="55" width="40" height="40" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-dasharray="3" class="diagram-dropzone" data-slot="relation"/>
          <text x="240" y="79" text-anchor="middle" fill="#38bdf8" font-size="14">?</text>
        `;
      } else {
        // Regular association line
        symbolSvg = `<line x1="175" y1="75" x2="305" y2="75" stroke="#94a3b8" stroke-width="2"/>`;
      }

      let svg = `
        <svg viewBox="0 0 ${width} ${height}" class="w-full max-w-lg mx-auto select-none" xmlns="http://www.w3.org/2000/svg">
          <!-- Class A -->
          <rect x="20" y="45" width="155" height="60" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
          <text x="97" y="75" text-anchor="middle" fill="#f8fafc" font-family="ui-monospace, monospace" font-size="13" font-weight="bold">
            ${config.classA}
          </text>
          <text x="97" y="92" text-anchor="middle" fill="#94a3b8" font-family="ui-monospace, monospace" font-size="10">
            ${config.subtextA || ''}
          </text>

          <!-- Relationship Line / Symbol -->
          <g class="diagram-hotspot cursor-pointer" data-hotspot-id="relation-link">
            ${symbolSvg}
          </g>

          <!-- Class B -->
          <rect x="305" y="45" width="155" height="60" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
          <text x="382" y="75" text-anchor="middle" fill="#f8fafc" font-family="ui-monospace, monospace" font-size="13" font-weight="bold">
            ${config.classB}
          </text>
          <text x="382" y="92" text-anchor="middle" fill="#94a3b8" font-family="ui-monospace, monospace" font-size="10">
            ${config.subtextB || ''}
          </text>
        </svg>
      `;
      return svg;
    }

    /**
     * Renders UML Use-Case Diagram with system boundary, actor and relations
     */
    renderUseCaseDiagram(config) {
      // config: { actorName: str, useCases: [{ name, id }], relations: [{ from, to, type: 'include'|'extend', isWrongArrow: bool, id }] }
      const width = 480;
      const height = 230;

      let svg = `
        <svg viewBox="0 0 ${width} ${height}" class="w-full max-w-lg mx-auto select-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="uc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
            </marker>
          </defs>

          <!-- System Boundary -->
          <rect x="140" y="15" width="325" height="200" rx="8" fill="#090d16" stroke="#334155" stroke-width="1.5"/>
          <text x="155" y="35" fill="#64748b" font-family="ui-monospace, monospace" font-size="11" font-weight="bold">
            Systemgrenze: Onlineshop
          </text>

          <!-- Actor (Stick Figure Outside System) -->
          <g class="diagram-hotspot cursor-pointer" data-hotspot-id="actor-human">
            <!-- Head -->
            <circle cx="65" cy="85" r="14" fill="#1e293b" stroke="#f8fafc" stroke-width="2"/>
            <!-- Body -->
            <line x1="65" y1="99" x2="65" y2="135" stroke="#f8fafc" stroke-width="2"/>
            <!-- Arms -->
            <line x1="45" y1="112" x2="85" y2="112" stroke="#f8fafc" stroke-width="2"/>
            <!-- Legs -->
            <line x1="65" y1="135" x2="50" y2="165" stroke="#f8fafc" stroke-width="2"/>
            <line x1="65" y1="135" x2="80" y2="165" stroke="#f8fafc" stroke-width="2"/>
            <!-- Actor Label -->
            <text x="65" y="185" text-anchor="middle" fill="#f8fafc" font-family="ui-monospace, monospace" font-size="11" font-weight="bold">
              ${config.actorName || 'Kunde'}
            </text>
          </g>

          <!-- Use Case 1: Bestellen -->
          <g class="diagram-hotspot cursor-pointer" data-hotspot-id="uc-main">
            <ellipse cx="235" cy="85" rx="65" ry="24" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="235" y="89" text-anchor="middle" fill="#f8fafc" font-size="11" font-family="ui-monospace, monospace">
              Artikel bestellen
            </text>
          </g>

          <!-- Use Case 2: Bezahlen (Include) -->
          <g class="diagram-hotspot cursor-pointer" data-hotspot-id="uc-sub">
            <ellipse cx="385" cy="85" rx="60" ry="24" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="385" y="89" text-anchor="middle" fill="#f8fafc" font-size="11" font-family="ui-monospace, monospace">
              Zahlung prüfen
            </text>
          </g>

          <!-- Association line from actor to main use case -->
          <line x1="85" y1="95" x2="170" y2="85" stroke="#64748b" stroke-width="1.5"/>

          <!-- Relationship between Use-Cases (Include / Extend) -->
          <g class="diagram-hotspot cursor-pointer group" data-hotspot-id="${config.relationId || 'uc-rel'}">
            <line x1="300" y1="85" x2="325" y2="85" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4" marker-end="url(#uc-arrow)"/>
            <rect x="270" y="55" width="85" height="18" rx="4" fill="#0f172a" stroke="#334155" class="group-hover:stroke-sky-400"/>
            <text x="312" y="68" text-anchor="middle" fill="#38bdf8" font-family="ui-monospace, monospace" font-size="10" font-weight="bold">
              ${config.stereotype || '<<include>>'}
            </text>
          </g>
        </svg>
      `;
      return svg;
    }

    escape(str) {
      if (!str) return '';
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  }

  window.DiagramEngine = DiagramEngine;
})();
