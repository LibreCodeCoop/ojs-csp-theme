! function t(e, n, r) {
	function o(s, a) {
		if (!n[s]) {
			if (!e[s]) {
				var c = "function" == typeof require && require;
				if (!a && c) return c(s, !0);
				if (i) return i(s, !0);
				var u = new Error("Cannot find module '" + s + "'");
				throw u.code = "MODULE_NOT_FOUND", u
			}
			var l = n[s] = {
				exports: {}
			};
			e[s][0].call(l.exports, function (t) {
				var n = e[s][1][t];
				return o(n ? n : t)
			}, l, l.exports, t, e, n, r)
		}
		return n[s].exports
	}
	for (var i = "function" == typeof require && require, s = 0; s < r.length; s++) o(r[s]);
	return o
}({
	1: [function (t, e, n) {
		window.Lens = t("./lens")
	}, {
		"./lens": 2
	}],
	2: [function (t, e, n) {
		"use strict";
		var r = t("lens/reader"),
			o = r.getDefaultPanels(),
			i = t("lens/converter"),
			s = t("lens/converter/elife_converter"),
			a = function (t) {
				r.call(this, t)
			};
		a.Prototype = function () {
			this.getConverters = function (t) {
				return [new s(t), new i(t)]
			}, this.getPanels = function () {
				return o.slice(0)
			}
		}, a.Prototype.prototype = r.prototype, a.prototype = new a.Prototype, a.prototype.constructor = a, e.exports = a
	}, {
		"lens/converter": 122,
		"lens/converter/elife_converter": 121,
		"lens/reader": 127
	}],
	3: [function (t, e, n) {}, {}],
	4: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../substance/util"),
			i = t("../substance/document"),
			s = function (t) {
				t = s.prepareOptions(t), i.call(this, t), this.bySourceId = this.addIndex("by_source_id", {
					property: "source_id"
				}), this.nodeTypes = t.nodeTypes, void 0 === t.seed && (this.create({
					id: "document",
					type: "document",
					guid: t.id,
					creator: t.creator,
					created_at: t.created_at,
					views: s.views,
					title: "",
					"abstract": "",
					authors: []
				}), r.each(s.views, function (t) {
					this.create({
						id: t,
						type: "view",
						nodes: []
					})
				}, this))
			};
		s.Prototype = function () {
			this.fromSnapshot = function (t, e) {
				return s.fromSnapshot(t, e)
			}, this.getNodeBySourceId = function (t) {
				var e = this.bySourceId.get(t),
					n = Object.keys(e)[0],
					r = e[n];
				return r
			}, this.getHeadings = function () {
				var t = r.filter(this.get("content").getNodes(), function (t) {
					return "heading" === t.type
				});
				return t
			}, this.getTocNodes = function () {
				var t = r.filter(this.get("content").getNodes(), function (t) {
					return t.includeInToc()
				});
				return t
			}
		}, s.prepareOptions = function (t) {
			return t = t || {}, t.nodeTypes = r.extend(s.nodeTypes, t.nodeTypes), t.schema = s.getSchema(t.nodeTypes), t
		}, s.getSchema = function (t) {
			var e = o.deepclone(i.schema);
			return e.id = "lens-article", e.version = "2.0.0", r.each(t, function (t, n) {
				e.types[n] = t.Model.type
			}), e
		}, s.fromSnapshot = function (t, e) {
			return e = e || {}, e.seed = t, new s(e)
		}, s.views = ["content", "figures", "citations", "info", "definitions"], s.nodeTypes = t("./nodes"), s.ViewFactory = t("./view_factory"), s.ResourceView = t("./resource_view");
		var a = {
			id: "lens_article",
			nodes: {
				document: {
					type: "document",
					id: "document",
					views: ["content"],
					title: "The Anatomy of a Lens Article",
					authors: ["contributor_1", "contributor_2", "contributor_3"],
					guid: "lens_article"
				},
				content: {
					type: "view",
					id: "content",
					nodes: ["cover"]
				},
				cover: {
					id: "cover",
					type: "cover"
				},
				contributor_1: {
					id: "contributor_1",
					type: "contributor",
					name: "Michael Aufreiter"
				},
				contributor_2: {
					id: "contributor_2",
					type: "contributor",
					name: "Ivan Grubisic"
				},
				contributor_3: {
					id: "contributor_3",
					type: "contributor",
					name: "Rebecca Close"
				}
			}
		};
		s.describe = function () {
			var t = new s({
					seed: a
				}),
				e = 0;
			return r.each(s.nodeTypes, function (n) {
				n = n.Model;
				var o = "heading_" + n.type.id;
				t.create({
					id: o,
					type: "heading",
					content: n.description.name,
					level: 1
				});
				var i = n.description.remarks.join(" "),
					s = "text_" + n.type.id + "_intro";
				t.create({
					id: s,
					type: "text",
					content: i
				}), t.show("content", [o, s], -1), t.create({
					id: o + "_properties",
					type: "text",
					content: n.description.name + " uses the following properties:"
				}), t.show("content", [o + "_properties"], -1);
				var a = [];
				r.each(n.description.properties, function (n, r) {
					var o = "text_" + ++e;
					t.create({
						id: o,
						type: "text",
						content: r + ": " + n
					}), t.create({
						id: e + "_annotation",
						type: "code",
						path: [o, "content"],
						range: [0, r.length]
					}), a.push(o)
				}), t.create({
					id: o + "_property_list",
					type: "list",
					items: a,
					ordered: !1
				}), t.show("content", [o + "_property_list"], -1), t.create({
					id: o + "_example",
					type: "text",
					content: "Here's an example:"
				}), t.create({
					id: o + "_example_codeblock",
					type: "codeblock",
					content: JSON.stringify(n.example, null, "  ")
				}), t.show("content", [o + "_example", o + "_example_codeblock"], -1)
			}), t
		}, s.Prototype.prototype = i.prototype, s.prototype = new s.Prototype, s.prototype.constructor = s, Object.defineProperties(s.prototype, {
			id: {
				get: function () {
					return this.get("document").guid
				},
				set: function (t) {
					this.get("document").guid = t
				}
			},
			creator: {
				get: function () {
					return this.get("document").creator
				},
				set: function (t) {
					this.get("document").creator = t
				}
			},
			created_at: {
				get: function () {
					return this.get("document").created_at
				},
				set: function (t) {
					this.get("document").created_at = t
				}
			},
			title: {
				get: function () {
					return this.get("document").title
				},
				set: function (t) {
					this.get("document").title = t
				}
			},
			"abstract": {
				get: function () {
					return this.get("document")["abstract"]
				},
				set: function (t) {
					this.get("document")["abstract"] = t
				}
			},
			on_behalf_of: {
				get: function () {
					return this.get("document").on_behalf_of
				},
				set: function (t) {
					this.get("document").on_behalf_of = t
				}
			},
			authors: {
				get: function () {
					var t = this.get("document");
					return t.authors ? r.map(t.authors, function (t) {
						return this.get(t)
					}, this) : ""
				},
				set: function (t) {
					var e = this.get("document");
					e.authors = r.clone(t)
				}
			},
			views: {
				get: function () {
					return this.get("document").views.slice(0)
				}
			}
		}), e.exports = s
	}, {
		"../substance/document": 167,
		"../substance/util": 175,
		"./nodes": 75,
		"./resource_view": 119,
		"./view_factory": 120,
		underscore: 124
	}],
	5: [function (t, e, n) {
		var r = {
				1: "January",
				2: "February",
				3: "March",
				4: "April",
				5: "May",
				6: "June",
				7: "July",
				8: "August",
				9: "September",
				10: "October",
				11: "November",
				12: "December"
			},
			o = {};
		o.formatDate = function (t) {
			var e = t.split("-");
			if (e.length >= 3) {
				var n = new Date(e[0], e[1] - 1, e[2]);
				return n.toUTCString().slice(0, 16)
			}
			if (2 === e.length) {
				var o = e[1].replace(/^0/, ""),
					i = e[0];
				return r[o] + " " + i
			}
			return i
		}, e.exports = o
	}, {}],
	6: [function (t, e, n) {
		"use strict";
		var r = t("./article");
		e.exports = r
	}, {
		"./article": 4
	}],
	7: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/document"),
			o = function (t, e) {
				r.Node.call(this, t, e)
			};
		o.type = {
			id: "affiliation",
			parent: "content",
			properties: {
				source_id: "string",
				city: "string",
				country: "string",
				department: "string",
				institution: "string",
				label: "string"
			}
		}, o.description = {
			name: "Affiliation",
			description: "Person affiliation",
			remarks: ["Name of a institution or organization, such as a university or corporation, that is the affiliation for a contributor such as an author or an editor."],
			properties: {
				institution: "Name of institution",
				department: "Department name",
				country: "Country where institution is located",
				city: "City of institution",
				label: "Affilation label. Usually a number counting up"
			}
		}, o.example = {
			id: "affiliation_1",
			source_id: "aff1",
			city: "Jena",
			country: "Germany",
			department: "Department of Molecular Ecology",
			institution: "Max Planck Institute for Chemical Ecology",
			label: "1",
			type: "affiliation"
		}, o.Prototype = function () {}, o.Prototype.prototype = r.Node.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, r.Node.defineProperties(o), e.exports = o
	}, {
		"../../../substance/document": 167
	}],
	8: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./affiliation")
		}
	}, {
		"./affiliation": 7
	}],
	9: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = function (t, e) {
				r.Node.call(this, t, e)
			};
		o.type = {
			id: "annotation",
			properties: {
				path: ["array", "string"],
				range: ["array", "number"]
			}
		}, o.Prototype = function () {
			this.getLevel = function () {
				return this.constructor.fragmentation
			}
		}, o.Prototype.prototype = r.Node.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, o.NEVER = 1, o.OK = 2, o.DONT_CARE = 3, o.fragmentation = o.DONT_CARE, r.Node.defineProperties(o), e.exports = o
	}, {
		"../../../substance/document": 167
	}],
	10: [function (t, e, n) {
		"use strict";
		var r = function (t, e) {
			this.node = t, this.viewFactory = e, this.el = this.createElement(), this.el.dataset.id = t.id, this.$el = $(this.el), this.setClasses()
		};
		r.Prototype = function () {
			this.createElement = function () {
				return document.createElement("span")
			}, this.setClasses = function () {
				this.$el.addClass("annotation").addClass(this.node.type)
			}, this.render = function () {
				return this
			}
		}, r.prototype = new r.Prototype, e.exports = r
	}, {}],
	11: [function (t, e, n) {
		e.exports = {
			Model: t("./annotation.js"),
			View: t("./annotation_view.js")
		}
	}, {
		"./annotation.js": 9,
		"./annotation_view.js": 10
	}],
	12: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = t("../annotation/annotation"),
			i = function (t, e) {
				o.call(this, t, e)
			};
		i.type = {
			id: "emphasis",
			parent: "annotation",
			properties: {
				style: "string"
			}
		}, i.Prototype = function () {}, i.Prototype.prototype = o.prototype, i.prototype = new i.Prototype, i.prototype.constructor = i, i.fragmentation = o.DONT_CARE, r.Node.defineProperties(i), e.exports = i
	}, {
		"../../../substance/document": 167,
		"../annotation/annotation": 9
	}],
	13: [function (t, e, n) {
		var r = t("../annotation").View,
			o = function (t) {
				r.call(this, t)
			};
		o.Prototype = function () {
			this.setClasses = function () {
				r.prototype.setClasses.call(this), this.$el.addClass(this.node.style)
			}
		}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, e.exports = o
	}, {
		"../annotation": 11
	}],
	14: [function (t, e, n) {
		e.exports = {
			Model: t("./author_callout.js"),
			View: t("./author_callout_view.js")
		}
	}, {
		"./author_callout.js": 12,
		"./author_callout_view.js": 13
	}],
	15: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/document"),
			o = r.Composite,
			i = function (t, e) {
				o.call(this, t, e)
			};
		i.type = {
			id: "box",
			parent: "content",
			properties: {
				source_id: "string",
				label: "string",
				children: ["array", "paragraph"]
			}
		}, i.description = {
			name: "Box",
			remarks: ["A box type."],
			properties: {
				label: "string",
				children: "0..n Paragraph nodes"
			}
		}, i.example = {
			id: "box_1",
			type: "box",
			label: "Box 1",
			children: ["paragraph_1", "paragraph_2"]
		}, i.Prototype = function () {
			this.getChildrenIds = function () {
				return this.properties.children
			}
		}, i.Prototype.prototype = o.prototype, i.prototype = new i.Prototype, i.prototype.constructor = i, r.Node.defineProperties(i), e.exports = i
	}, {
		"../../../substance/document": 167
	}],
	16: [function (t, e, n) {
		"use strict";
		var r = t("../node").View,
			o = t("../composite").View,
			i = t("../../../substance/application").$$,
			s = function (t, e) {
				o.call(this, t, e)
			};
		s.Prototype = function () {
			this.render = function () {
				if (r.prototype.render.call(this), this.node.label) {
					var t = i(".label", {
						text: this.node.label
					});
					this.content.appendChild(t)
				}
				return this.renderChildren(), this.el.appendChild(this.content), this
			}
		}, s.Prototype.prototype = o.prototype, s.prototype = new s.Prototype, e.exports = s
	}, {
		"../../../substance/application": 154,
		"../composite": 32,
		"../node": 87
	}],
	17: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./box"),
			View: t("./box_view")
		}
	}, {
		"./box": 15,
		"./box_view": 16
	}],
	18: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/document"),
			o = function (t, e) {
				r.Composite.call(this, t, e)
			};
		o.type = {
			id: "caption",
			parent: "content",
			properties: {
				source_id: "string",
				title: "paragraph",
				children: ["array", "paragraph"]
			}
		}, o.description = {
			name: "Caption",
			remarks: ["Container element for the textual description that is associated with a Figure, Table, Video node etc.", "This is the title for the figure or the description of the figure that prints or displays with the figure."],
			properties: {
				title: "Caption title (optional)",
				children: "0..n Paragraph nodes"
			}
		}, o.example = {
			id: "caption_1",
			children: ["paragraph_1", "paragraph_2"]
		}, o.Prototype = function () {
			this.getChildrenIds = function () {
				return this.properties.children || []
			}, this.hasTitle = function () {
				return !!this.properties.title
			}, this.getTitle = function () {
				return this.properties.title ? this.document.get(this.properties.title) : void 0
			}
		}, o.Prototype.prototype = r.Composite.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, r.Node.defineProperties(o), e.exports = o
	}, {
		"../../../substance/document": 167
	}],
	19: [function (t, e, n) {
		"use strict";
		var r = t("../composite").View,
			o = t("../../../substance/application").$$,
			i = function (t, e) {
				r.call(this, t, e)
			};
		i.Prototype = function () {
			this.render = function () {
				this.content = o("div.content");
				var t = this.node.getTitle();
				if (t) {
					var e = this.createChildView(this.node.title),
						n = e.render().el;
					n.classList.add("caption-title"), this.content.appendChild(n)
				}
				return this.renderChildren(), this.el.appendChild(this.content), this
			}
		}, i.Prototype.prototype = r.prototype, i.prototype = new i.Prototype, e.exports = i
	}, {
		"../../../substance/application": 154,
		"../composite": 32
	}],
	20: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./caption"),
			View: t("./caption_view")
		}
	}, {
		"./caption": 18,
		"./caption_view": 19
	}],
	21: [function (t, e, n) {
		var r = t("underscore"),
			o = t("../../../substance/document"),
			i = function (t, e) {
				o.Node.call(this, t, e)
			};
		i.type = {
			id: "article_citation",
			parent: "content",
			properties: {
				source_id: "string",
				title: "string",
				label: "string",
				authors: ["array", "string"],
				doi: "string",
				source: "string",
				volume: "string",
				citation_type: "string",
				publisher_name: "string",
				publisher_location: "string",
				fpage: "string",
				lpage: "string",
				year: "string",
				comment: "string",
				citation_urls: ["array", "object"],
				source_formats: ["array", "object"]
			}
		}, i.description = {
			name: "Citation",
			remarks: ["A journal citation.", "This element can be used to describe all kinds of citations."],
			properties: {
				title: "The article's title",
				label: "Optional label (could be a number for instance)",
				doi: "DOI reference",
				source: "Usually the journal name",
				volume: "Issue number",
				citation_type: "Citation Type",
				publisher_name: "Publisher Name",
				publisher_location: "Publisher Location",
				fpage: "First page",
				lpage: "Last page",
				year: "The year of publication",
				comment: "Author comment.",
				citation_urls: "A list of links for accessing the article on the web"
			}
		}, i.example = {
			id: "article_nature08160",
			type: "article_citation",
			label: "5",
			title: "The genome of the blood fluke Schistosoma mansoni",
			authors: ["M Berriman", "BJ Haas", "PT LoVerde"],
			citation_type: "Journal Article",
			doi: "http://dx.doi.org/10.1038/nature08160",
			source: "Nature",
			volume: "460",
			fpage: "352",
			lpage: "8",
			year: "1984",
			comment: "This is a comment.",
			citation_urls: [{
				name: "PubMed",
				url: "http://www.ncbi.nlm.nih.gov/pubmed/19606141"
			}]
		}, i.Prototype = function () {
			this.urls = function () {
				return this.properties.citation_urls.length > 0 ? this.properties.citation_urls : [this.properties.doi]
			}, this.getHeader = function () {
				return r.compact([this.properties.label, this.properties.citation_type]).join(" - ")
			}
		}, i.Prototype.prototype = o.Node.prototype, i.prototype = new i.Prototype, i.prototype.constructor = i, o.Node.defineProperties(i), e.exports = i
	}, {
		"../../../substance/document": 167,
		underscore: 124
	}],
	22: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../../../substance/application").$$,
			i = t("../node").View,
			s = t("../../resource_view"),
			a = function (t, e, n) {
				i.apply(this, arguments), s.call(this, n)
			};
		a.Prototype = function () {
			r.extend(this, s.prototype), this.renderBody = function () {
				var t = document.createDocumentFragment(),
					e = this.node,
					n = this.createTextPropertyView([e.id, "title"], {
						classes: "title"
					});
				t.appendChild(n.render().el), t.appendChild(o(".authors", {
					html: e.authors.join(", ")
				}));
				var i = "",
					s = "",
					a = "",
					c = "";
				e.source && "" === e.volume ? s = e.source : e.source && e.volume && (s = [e.source, e.volume].join(", ")), e.fpage && e.lpage && (a = [e.fpage, e.lpage].join("-"));
				var u = [];
				if (e.publisher_name && e.publisher_location && (u.push(e.publisher_name), u.push(e.publisher_location)), e.year && u.push(e.year), c = u.join(", "), i = s, s && (a || c) && (i += ": "), a && c ? i += [a, c].join(", ") : (i += a, i += c), t.appendChild(o(".source", {
						html: i
					})), e.comment) {
					var l = this.createTextView({
						path: [e.id, "comment"],
						classes: "comment"
					});
					t.appendChild(l.render().el)
				}
				if (e.doi && t.appendChild(o(".doi", {
						children: [o("b", {
							text: "DOI: "
						}), o("a", {
							href: e.doi,
							target: "_new",
							text: e.doi
						})]
					})), e.citation_urls.length > 0) {
					var p = o(".citation-urls");
					r.each(e.citation_urls, function (t) {
						p.appendChild(o("a.url", {
							href: t.url,
							text: t.name,
							target: "_blank"
						}))
					}), t.appendChild(p)
				}
				this.content.appendChild(t)
			}
		}, a.Prototype.prototype = i.prototype, a.prototype = new a.Prototype, a.prototype.constructor = a, e.exports = a
	}, {
		"../../../substance/application": 154,
		"../../resource_view": 119,
		"../node": 87,
		underscore: 124
	}],
	23: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./citation"),
			View: t("./citation_view")
		}
	}, {
		"./citation": 21,
		"./citation_view": 22
	}],
	24: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = t("../annotation/annotation"),
			i = t("../resource_reference/resource_reference"),
			s = function (t, e) {
				i.call(this, t, e)
			};
		s.type = {
			id: "citation_reference",
			parent: "resource_reference",
			properties: {
				target: "citation"
			}
		}, s.Prototype = function () {}, s.Prototype.prototype = i.prototype, s.prototype = new s.Prototype, s.prototype.constructor = s, s.fragmentation = o.NEVER, r.Node.defineProperties(s), e.exports = s
	}, {
		"../../../substance/document": 167,
		"../annotation/annotation": 9,
		"../resource_reference/resource_reference": 97
	}],
	25: [function (t, e, n) {
		e.exports = {
			Model: t("./citation_reference.js"),
			View: t("../resource_reference/resource_reference_view.js")
		}
	}, {
		"../resource_reference/resource_reference_view.js": 98,
		"./citation_reference.js": 24
	}],
	26: [function (t, e, n) {
		var r = t("../annotation/annotation"),
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.type = {
			id: "underline",
			parent: "annotation",
			properties: {}
		}, o.Prototype = function () {}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, o.fragmentation = r.DONT_CARE, e.exports = o
	}, {
		"../annotation/annotation": 9
	}],
	27: [function (t, e, n) {
		e.exports = {
			Model: t("./code.js"),
			View: t("../annotation/annotation_view.js")
		}
	}, {
		"../annotation/annotation_view.js": 10,
		"./code.js": 26
	}],
	28: [function (t, e, n) {
		"use strict";
		var r = t("../text").Model,
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.type = {
			id: "codeblock",
			parent: "content",
			properties: {
				source_id: "string",
				content: "string"
			}
		}, o.config = {
			zoomable: !0
		}, o.description = {
			name: "Codeblock",
			remarks: ["Text in a codeblock is displayed in a fixed-width font, and it preserves both spaces and line breaks"],
			properties: {
				content: "Content"
			}
		}, o.example = {
			type: "codeblock",
			id: "codeblock_1",
			content: 'var text = "Sun";\nvar op1 = null;\ntext = op2.apply(op1.apply(text));\nconsole.log(text);'
		}, o.Prototype = function () {}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, e.exports = o
	}, {
		"../text": 108
	}],
	29: [function (t, e, n) {
		"use strict";
		var r = t("../text/text_view"),
			o = function (t) {
				r.call(this, t)
			};
		o.Prototype = function () {}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, e.exports = o
	}, {
		"../text/text_view": 111
	}],
	30: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./codeblock"),
			View: t("./codeblock_view")
		}
	}, {
		"./codeblock": 28,
		"./codeblock_view": 29
	}],
	31: [function (t, e, n) {
		"use strict";
		var r = t("../node").View,
			o = function (t, e) {
				r.call(this, t, e), this.childrenViews = []
			};
		o.Prototype = function () {
			this.render = function () {
				return r.prototype.render.call(this), this.renderChildren(), this
			}, this.renderChildren = function () {
				for (var t = this.node.getChildrenIds(), e = 0; e < t.length; e++) {
					var n = this.createChildView(t[e]),
						r = n.render().el;
					this.content.appendChild(r)
				}
			}, this.dispose = function () {
				r.prototype.dispose.call(this);
				for (var t = 0; t < this.childrenViews.length; t++) this.childrenViews[t].dispose()
			}, this["delete"] = function () {}, this.getCharPosition = function () {
				return 0
			}, this.getDOMPosition = function () {
				var t = this.$(".content")[0],
					e = document.createRange();
				return e.setStartBefore(t.childNodes[0]), e
			}, this.createChildView = function (t) {
				var e = this.createView(t);
				return this.childrenViews.push(e), e
			}
		}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, e.exports = o
	}, {
		"../node": 87
	}],
	32: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/document");
		e.exports = {
			Model: r.Composite,
			View: t("./composite_view")
		}
	}, {
		"../../../substance/document": 167,
		"./composite_view": 31
	}],
	33: [function (t, e, n) {
		var r = t("underscore"),
			o = t("../../../substance/document"),
			i = function (t, e) {
				o.Node.call(this, t, e)
			};
		i.type = {
			id: "contributor",
			parent: "content",
			properties: {
				source_id: "string",
				name: "string",
				role: "string",
				contributor_type: "string",
				affiliations: ["array", "affiliation"],
				present_address: ["string"],
				fundings: ["array", "string"],
				image: "string",
				emails: ["array", "string"],
				contribution: "string",
				bio: ["array", "paragraph"],
				deceased: "boolean",
				members: ["array", "string"],
				orcid: "string",
				equal_contrib: ["array", "string"],
				competing_interests: ["array", "string"]
			}
		}, i.description = {
			name: "Contributor",
			remarks: ["A contributor entity."],
			properties: {
				name: "Full name",
				affiliations: "A list of affiliation ids",
				present_address: "Present address of the contributor",
				role: "Role of contributor (e.g. Author, Editor)",
				fundings: "A list of funding descriptions",
				deceased: !1,
				emails: "A list of emails",
				orcid: "ORCID",
				contribution: "Description of contribution",
				equal_contrib: "A list of people who contributed equally",
				competing_interests: "A list of conflicts",
				members: "a list of group members"
			}
		}, i.example = {
			id: "person_1",
			type: "contributor",
			name: "John Doe",
			affiliations: ["affiliation_1", "affiliation_2"],
			role: "Author",
			fundings: ["Funding Organisation 1"],
			emails: ["a@b.com"],
			contribution: "Revising the article, data cleanup",
			equal_contrib: ["John Doe", "Jane Doe"]
		}, i.Prototype = function () {
			this.getAffiliations = function () {
				return r.map(this.properties.affiliations, function (t) {
					return this.document.get(t)
				}, this)
			}, this.getHeader = function () {
				return this.properties.contributor_type || "Author"
			}
		}, i.Prototype.prototype = o.Node.prototype, i.prototype = new i.Prototype, i.prototype.constructor = i, o.Node.defineProperties(i), e.exports = i
	}, {
		"../../../substance/document": 167,
		underscore: 124
	}],
	34: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../node").View,
			i = t("../../../substance/application").$$,
			s = t("../../resource_view"),
			a = function (t, e, n) {
				o.call(this, t, e), s.call(this, n)
			};
		a.Prototype = function () {
			r.extend(this, s.prototype), this.renderBody = function () {
				if (this.content.appendChild(i(".contributor-name", {
						text: this.node.name
					})), this.node.role && this.content.appendChild(i(".role", {
						text: this.node.role
					})), this.content.appendChild(i(".affiliations", {
						children: r.map(this.node.getAffiliations(), function (t) {
							var e = r.compact([t.department, t.institution, t.city, t.country]).join(", ");
							return i(".affiliation", {
								text: e
							})
						})
					})), this.node.orcid && (this.content.appendChild(i("a.orcid", {
						href: 'https://orcid.org/'+this.node.orcid,
						text: 'https://orcid.org/'+this.node.orcid
					}))), this.node.present_address && (this.content.appendChild(i(".label", {
						text: "Present address"
					})), this.content.appendChild(i(".contribution", {
						text: this.node.present_address
					}))), this.node.contribution && (this.content.appendChild(i(".label", {
						text: "Contribution"
					})), this.content.appendChild(i(".contribution", {
						text: this.node.contribution
					}))), this.node.equal_contrib && this.node.equal_contrib.length > 0 && (this.content.appendChild(i(".label", {
						text: "Contributed equally with"
					})), this.content.appendChild(i(".equal-contribution", {
						text: this.node.equal_contrib
					}))), this.node.emails.length > 0 && (this.content.appendChild(i(".label", {
						text: "For correspondence"
					})), this.content.appendChild(i(".emails", {
						children: r.map(this.node.emails, function (t) {
							return i("a", {
								href: "mailto:" + t,
								text: t
							})
						})
					}))), this.node.fundings.length > 0 && (this.content.appendChild(i(".label", {
						text: "Funding"
					})), this.content.appendChild(i(".fundings", {
						children: r.map(this.node.fundings, function (t) {
							return i(".funding", {
								text: t
							})
						})
					}))), this.node.competing_interests.length > 0 && (this.content.appendChild(i(".label", {
						text: "Competing Interests"
					})), this.content.appendChild(i(".competing-interests", {
						children: r.map(this.node.competing_interests, function (t) {
							return i(".conflict", {
								text: t
							})
						})
					}))), this.node.members.length > 0 && (this.content.appendChild(i(".label", {
						text: "Group Members"
					})), this.content.appendChild(i(".members", {
						children: r.map(this.node.members, function (t) {
							return i(".member", {
								text: t
							})
						})
					}))), this.node.image || this.node.bio && this.node.bio.length > 0) {
					var t = i(".bio"),
						e = [i("img", {
							src: this.node.image
						}), t];
					r.each(this.node.bio, function (e) {
						t.appendChild(this.createView(e).render().el)
					}, this), this.content.appendChild(i(".contributor-bio.container", {
						children: e
					}))
				}
				this.node.deceased && this.content.appendChild(i(".label", {
					text: "* Deceased"
				}))
			}
		}, a.Prototype.prototype = o.prototype, a.prototype = new a.Prototype, e.exports = a
	}, {
		"../../../substance/application": 154,
		"../../resource_view": 119,
		"../node": 87,
		underscore: 124
	}],
	35: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./contributor"),
			View: t("./contributor_view")
		}
	}, {
		"./contributor": 33,
		"./contributor_view": 34
	}],
	36: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = t("../annotation/annotation"),
			i = t("../resource_reference/resource_reference"),
			s = function (t, e) {
				i.call(this, t, e)
			};
		s.type = {
			id: "contributor_reference",
			parent: "resource_reference",
			properties: {
				target: "contributor"
			}
		}, s.Prototype = function () {}, s.Prototype.prototype = i.prototype, s.prototype = new s.Prototype, s.prototype.constructor = s, s.fragmentation = o.NEVER, r.Node.defineProperties(s), e.exports = s
	}, {
		"../../../substance/document": 167,
		"../annotation/annotation": 9,
		"../resource_reference/resource_reference": 97
	}],
	37: [function (t, e, n) {
		e.exports = {
			Model: t("./contributor_reference.js"),
			View: t("../resource_reference/resource_reference_view.js")
		}
	}, {
		"../resource_reference/resource_reference_view.js": 98,
		"./contributor_reference.js": 36
	}],
	38: [function (t, e, n) {
		var r = t("underscore"),
			o = t("../../../substance/document"),
			i = function (t, e) {
				o.Node.call(this, t, e)
			};
		i.type = {
			id: "cover",
			parent: "content",
			properties: {
				source_id: "string",
				authors: ["array", "paragraph"],
				breadcrumbs: "object"
			}
		}, i.description = {
			name: "Cover",
			remarks: ["Virtual view on the title and authors of the paper."],
			properties: {
				authors: "A paragraph that has the authors names plus references to the person cards"
			}
		}, i.example = {
			id: "cover",
			type: "cover"
		}, i.Prototype = function () {
			this.getAuthors = function () {
				return r.map(this.properties.authors, function (t) {
					return this.document.get(t)
				}, this)
			}, this.getTitle = function () {
				return this.document.title
			}
		}, i.Prototype.prototype = o.Node.prototype, i.prototype = new i.Prototype, i.prototype.constructor = i, o.Node.defineProperties(i), e.exports = i
	}, {
		"../../../substance/document": 167,
		underscore: 124
	}],
	39: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../node").View,
			i = t("../../../substance/application").$$,
			s = t("../../article_util"),
			a = function (t, e) {
				o.call(this, t, e)
			};
		a.Prototype = function () {
			this.render = function () {
				o.prototype.render.call(this);
				var t = this.node,
					e = this.node.document.get("publication_info");
				if (t.breadcrumbs && t.breadcrumbs.length > 0) {
					var n = i(".breadcrumbs", {
						children: r.map(t.breadcrumbs, function (t) {
							var e;
							return e = t.image ? '<img src="' + t.image + '" title="' + t.name + '"/>' : t.name, i("a", {
								href: t.url,
								html: e
							})
						})
					});
					this.content.appendChild(n)
				}
				if (e) {
					var a = e.published_on;
					var m = e.published_on_month_year;
					if (a) {
						var c = ["<i>" + e.journal + "</i>, "];
						c.push(s.formatDate(m));
						e.journal && !t.breadcrumbs && c.push(a), this.content.appendChild(i(".published-on", {
							html: c.join("")
						}))
					}
				}
				var u = this.createTextPropertyView(["document", "title"], {
					classes: "title",
					elementType: "div"
				});
				this.content.appendChild(u.render().el);
				var l = i(".authors", {
					children: r.map(t.getAuthors(), function (t) {
						var e = this.viewFactory.createView(t),
							n = e.render().el;
						return this.content.appendChild(n), n
					}, this)
				});
				if (l.appendChild(i(".content-node.text.plain", {
						children: [i(".content", {
							text: this.node.document.on_behalf_of
						})]
					})), this.content.appendChild(l), e && e.links.length > 0) {
					var p = i(".links");
					r.each(e.links, function (t) {
						if ("json" === t.type && "" === t.url) {
							var e = JSON.stringify(this.node.document.toJSON(), null, "  "),
								n = new Blob([e], {
									type: "application/json"
								});
							p.appendChild(i("a.json", {
								href: window.URL ? window.URL.createObjectURL(n) : "#",
								html: '<i class="fa fa-external-link-square"></i> ' + t.name,
								target: "_blank"
							}))
						} else p.appendChild(i("a." + t.type, {
							href: t.url,
							html: '<i class="fa fa-external-link-square"></i> ' + t.name,
							target: "_blank"
						}))
					}, this), this.content.appendChild(p)
				}
				if (e) {
					var h = e.doi;
					h && this.content.appendChild(i(".doi", {
						html: 'DOI: <a href="http://dx.doi.org/' + h + '">' + h + "</a>"
					}))
				}
				return this
			}
		}, a.Prototype.prototype = o.prototype, a.prototype = new a.Prototype, e.exports = a
	}, {
		"../../../substance/application": 154,
		"../../article_util": 5,
		"../node": 87,
		underscore: 124
	}],
	40: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./cover"),
			View: t("./cover_view")
		}
	}, {
		"./cover": 38,
		"./cover_view": 39
	}],
	41: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = t("../annotation/annotation"),
			i = function (t, e) {
				o.call(this, t, e)
			};
		i.type = {
			id: "cross_reference",
			parent: "annotation",
			properties: {
				target: "node"
			}
		}, i.Prototype = function () {}, i.Prototype.prototype = o.prototype, i.prototype = new i.Prototype, i.prototype.constructor = i, i.fragmentation = o.NEVER, r.Node.defineProperties(i), e.exports = i
	}, {
		"../../../substance/document": 167,
		"../annotation/annotation": 9
	}],
	42: [function (t, e, n) {
		e.exports = {
			Model: t("./cross_reference.js"),
			View: t("../resource_reference/resource_reference_view.js")
		}
	}, {
		"../resource_reference/resource_reference_view.js": 98,
		"./cross_reference.js": 41
	}],
	43: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = t("../annotation/annotation"),
			i = function (t, e) {
				o.call(this, t, e)
			};
		i.type = {
			id: "custom_annotation",
			parent: "annotation",
			properties: {
				name: "string"
			}
		}, i.Prototype = function () {}, i.Prototype.prototype = o.prototype, i.prototype = new i.Prototype, i.prototype.constructor = i, i.fragmentation = o.DONT_CARE, r.Node.defineProperties(i), e.exports = i
	}, {
		"../../../substance/document": 167,
		"../annotation/annotation": 9
	}],
	44: [function (t, e, n) {
		var r = t("../annotation").View,
			o = function (t) {
				r.call(this, t)
			};
		o.Prototype = function () {
			this.setClasses = function () {
				r.prototype.setClasses.call(this), this.$el.addClass(this.node.name)
			}
		}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, e.exports = o
	}, {
		"../annotation": 11
	}],
	45: [function (t, e, n) {
		e.exports = {
			Model: t("./custom_annotation.js"),
			View: t("./custom_annotation_view.js")
		}
	}, {
		"./custom_annotation.js": 43,
		"./custom_annotation_view.js": 44
	}],
	46: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = function (t) {
				r.Node.call(this, t)
			};
		o.type = {
			id: "definition",
			parent: "content",
			properties: {
				source_id: "string",
				title: "string",
				description: "string"
			}
		}, o.description = {
			name: "Definition",
			remarks: ["A journal citation.", "This element can be used to describe all kinds of citations."],
			properties: {
				title: "The article's title",
				description: "Definition description"
			}
		}, o.example = {
			id: "definition_def1",
			type: "Definition",
			title: "IAP",
			description: "Integrated Analysis Platform"
		}, o.Prototype = function () {
			this.urls = function () {
				return this.properties.citation_urls.length > 0 ? this.properties.citation_urls : [this.properties.doi]
			}, this.getHeader = function () {
				return this.properties.label ? [this.properties.label, this.properties.title].join(". ") : this.properties.title
			}
		}, o.Prototype.prototype = r.Node.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, r.Node.defineProperties(o), e.exports = o
	}, {
		"../../../substance/document": 167
	}],
	47: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../node").View,
			i = t("../../../substance/application").$$,
			s = t("../../resource_view"),
			a = function (t, e, n) {
				o.call(this, t, e), s.call(this, n)
			};
		a.Prototype = function () {
			r.extend(this, s.prototype), this.renderBody = function () {
				this.content.appendChild(i(".description", {
					text: this.node.description
				}))
			}
		}, a.Prototype.prototype = o.prototype, a.prototype = new a.Prototype, a.prototype.constructor = a, e.exports = a
	}, {
		"../../../substance/application": 154,
		"../../resource_view": 119,
		"../node": 87,
		underscore: 124
	}],
	48: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./definition"),
			View: t("./definition_view")
		}
	}, {
		"./definition": 46,
		"./definition_view": 47
	}],
	49: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = t("../annotation/annotation"),
			i = t("../resource_reference/resource_reference"),
			s = function (t, e) {
				i.call(this, t, e)
			};
		s.type = {
			id: "definition_reference",
			parent: "resource_reference",
			properties: {
				target: "definition"
			}
		}, s.Prototype = function () {}, s.Prototype.prototype = i.prototype, s.prototype = new s.Prototype, s.prototype.constructor = s, s.fragmentation = o.NEVER, r.Node.defineProperties(s), e.exports = s
	}, {
		"../../../substance/document": 167,
		"../annotation/annotation": 9,
		"../resource_reference/resource_reference": 97
	}],
	50: [function (t, e, n) {
		e.exports = {
			Model: t("./definition_reference.js"),
			View: t("../resource_reference/resource_reference_view.js")
		}
	}, {
		"../resource_reference/resource_reference_view.js": 98,
		"./definition_reference.js": 49
	}],
	51: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/document"),
			o = function (t, e) {
				r.Node.call(this, t, e)
			};
		o.type = {
			id: "document",
			parent: "content",
			properties: {
				views: ["array", "view"],
				guid: "string",
				creator: "string",
				title: "string",
				authors: ["array", "contributor"],
				on_behalf_of: "string",
				"abstract": "string"
			}
		}, o.Prototype = function () {}, o.Prototype.prototype = r.Node.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, r.Node.defineProperties(o), e.exports = o
	}, {
		"../../../substance/document": 167
	}],
	52: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./document_node")
		}
	}, {
		"./document_node": 51
	}],
	53: [function (t, e, n) {
		var r = t("../annotation/annotation"),
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.type = {
				id: "emphasis",
				parent: "annotation",
				properties: {}
			}, o.Prototype = function () {}, o.Prototype.prototype = r.prototype,
			o.prototype = new o.Prototype, o.prototype.constructor = o, o.fragmentation = r.DONT_CARE, e.exports = o
	}, {
		"../annotation/annotation": 9
	}],
	54: [function (t, e, n) {
		e.exports = {
			Model: t("./emphasis.js"),
			View: t("../annotation/annotation_view.js")
		}
	}, {
		"../annotation/annotation_view.js": 10,
		"./emphasis.js": 53
	}],
	55: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/document"),
			o = function (t, e) {
				r.Composite.call(this, t, e)
			};
		o.type = {
			parent: "content",
			properties: {
				source_id: "string",
				label: "string",
				url: "string",
				caption: "caption",
				position: "string",
				attrib: "string"
			}
		}, o.config = {
			zoomable: !0
		}, o.description = {
			name: "Figure",
			remarks: ["A figure is a figure is figure."],
			properties: {
				label: "Label used as header for the figure cards",
				url: "Image url",
				caption: "A reference to a caption node that describes the figure",
				attrib: "Figure attribution"
			}
		}, o.example = {
			id: "figure_1",
			label: "Figure 1",
			url: "http://example.com/fig1.png",
			caption: "caption_1"
		}, o.Prototype = function () {
			this.hasCaption = function () {
				return !!this.properties.caption
			}, this.getChildrenIds = function () {
				var t = [];
				return this.properties.caption && t.push(this.properties.caption), t
			}, this.getCaption = function () {
				return this.properties.caption ? this.document.get(this.properties.caption) : void 0
			}, this.getHeader = function () {
				return this.properties.label
			}
		}, o.Prototype.prototype = r.Composite.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, r.Node.defineProperties(o.prototype, Object.keys(o.type.properties)), e.exports = o
	}, {
		"../../../substance/document": 167
	}],
	56: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../composite").View,
			i = t("../../../substance/application").$$,
			s = t("../../resource_view"),
			a = function (t, e, n) {
				o.call(this, t, e), s.call(this, n)
			};
		a.Prototype = function () {
			r.extend(this, s.prototype), this.isZoomable = !0, this.renderBody = function () {
				if (this.content.appendChild(i(".label", {
						text: this.node.label
					})), this.node.url) {
					var t = i(".image-wrapper", {
						children: [i("a.toggle.toggle-fullscreen", {
							href: "#",
							target: "_blank",
							children: [i("img", {
								src: this.node.url
							})]
						})]

					});
					this.content.appendChild(t)
				}
				this.renderChildren(), this.node.attrib && this.content.appendChild(i(".figure-attribution", {
					text: this.node.attrib
				}))
			}, this.renderLabel = function () {
				var t = i(".name", {
					href: "#"
				});
				return this.renderAnnotatedText([this.node.id, "label"], t), t
			}
		}, a.Prototype.prototype = o.prototype, a.prototype = new a.Prototype, e.exports = a
	}, {
		"../../../substance/application": 154,
		"../../resource_view": 119,
		"../composite": 32,
		underscore: 124
	}],
	57: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./figure"),
			View: t("./figure_view")
		}
	}, {
		"./figure": 55,
		"./figure_view": 56
	}],
	58: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = t("../annotation/annotation"),
			i = t("../resource_reference/resource_reference"),
			s = function (t, e) {
				i.call(this, t, e)
			};
		s.type = {
			id: "figure_reference",
			parent: "resource_reference",
			properties: {
				target: "figure"
			}
		}, s.Prototype = function () {}, s.Prototype.prototype = i.prototype, s.prototype = new s.Prototype, s.prototype.constructor = s, s.fragmentation = o.NEVER, r.Node.defineProperties(s), e.exports = s
	}, {
		"../../../substance/document": 167,
		"../annotation/annotation": 9,
		"../resource_reference/resource_reference": 97
	}],
	59: [function (t, e, n) {
		e.exports = {
			Model: t("./figure_reference.js"),
			View: t("../resource_reference/resource_reference_view.js")
		}
	}, {
		"../resource_reference/resource_reference_view.js": 98,
		"./figure_reference.js": 58
	}],
	60: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/document"),
			o = r.Node,
			i = t("../paragraph").Model,
			s = function (t, e) {
				i.call(this, t, e)
			};
		s.type = {
			id: "footnote",
			parent: "paragraph",
			properties: {
				label: "string"
			}
		}, s.description = {
			name: "Footnote",
			remarks: ["A Footnote is basically a Paragraph with a label."],
			properties: {
				label: "A string used as label"
			}
		}, s.example = {
			type: "footnote",
			id: "footnote_1",
			label: "a",
			"children ": ["text_1", "image_1", "text_2"]
		}, s.Prototype = function () {}, s.Prototype.prototype = i.prototype, s.prototype = new s.Prototype, s.prototype.constructor = s, o.defineProperties(s), e.exports = s
	}, {
		"../../../substance/document": 167,
		"../paragraph": 90
	}],
	61: [function (t, e, n) {
		"use strict";
		var r = t("../paragraph").View,
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.Prototype = function () {
			this.render = function () {
				r.prototype.render.call(this);
				var t = document.createElement("span");
				return t.classList.add("label"), t.innerHTML = this.node.label, this.el.insertBefore(t, this.content), this
			}
		}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, e.exports = o
	}, {
		"../paragraph": 90
	}],
	62: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./footnote"),
			View: t("./footnote_view")
		}
	}, {
		"./footnote": 60,
		"./footnote_view": 61
	}],
	63: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = function (t) {
				r.Node.call(this, t)
			};
		o.type = {
			id: "formula",
			parent: "content",
			properties: {
				source_id: "string",
				inline: "boolean",
				label: "string",
				format: ["array", "string"],
				data: ["array", "string"]
			}
		}, o.description = {
			name: "Formula",
			remarks: ["Can either be expressed in MathML format or using an image url"],
			properties: {
				label: "Formula label (4)",
				data: "Formula data, either MathML or image url",
				format: "Can either be `mathml` or `image`"
			}
		}, o.example = {
			type: "formula",
			id: "formula_eqn1",
			label: "(1)",
			content: "<mml:mrow>...</mml:mrow>",
			format: "mathml"
		}, o.Prototype = function () {
			this.inline = !1
		}, o.Prototype.prototype = r.Node.prototype, o.prototype = new o.Prototype, o.prototype.constuctor = o, r.Node.defineProperties(o), e.exports = o
	}, {
		"../../../substance/document": 167
	}],
	64: [function (t, e, n) {
		"use strict";
		var r = t("../node").View,
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.Prototype = function () {
			var t = {
					latex: "math/tex",
					mathml: "math/mml"
				},
				e = {
					image: 0,
					mathml: 1,
					latex: 2
				};
			this.render = function () {
				this.node.inline && this.$el.addClass("inline");
				var n, r = [];
				for (n = 0; n < this.node.data.length; n++) r.push({
					format: this.node.format[n],
					data: this.node.data[n]
				});
				if (r.sort(function (t, n) {
						return e[t.format] - e[n.format]
					}), r.length > 0) {
					var o = !1,
						i = !1;
					for (n = 0; n < r.length; n++) {
						var s = r[n].format,
							a = r[n].data;
						switch (s) {
							case "mathml":
								i || (this.$el.append($(a)), i = !0, o && (this.$preview.hide(), o = !0));
								break;
							case "latex":
								if (!i) {
									var c = t[s];
									this.node.inline || (c += "; mode=display");
									var u = $("<script>").attr("type", c).html(a);
									this.$el.append(u), i = !0
								}
								break;
							case "image":
								if (!o) {
									var l = $("<div>").addClass("MathJax_Preview");
									l.append($("<img>").attr("src", a)), this.$el.append(l), this.$preview = l, o = !0
								}
								break;
							default:
								console.error("Unknown formula format:", s)
						}
					}
				}
				return this.node.label && this.$el.append($('<div class="label">').html(this.node.label)), this
			}
		}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, e.exports = o
	}, {
		"../node": 87
	}],
	65: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./formula"),
			View: t("./formula_view")
		}
	}, {
		"./formula": 63,
		"./formula_view": 64
	}],
	66: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/document"),
			o = r.Node,
			i = t("../text/text_node"),
			s = function (t, e) {
				i.call(this, t, e)
			};
		s.type = {
			id: "heading",
			parent: "content",
			properties: {
				source_id: "string",
				content: "string",
				label: "string",
				level: "number"
			}
		}, s.example = {
			type: "heading",
			id: "heading_1",
			content: "Introduction",
			level: 1
		}, s.description = {
			name: "Heading",
			remarks: ["Denotes a section or sub section in your article."],
			properties: {
				content: "Heading title",
				label: "Heading label",
				level: "Heading level. Ranges from 1..4"
			}
		}, s.Prototype = function () {
			this.splitInto = "paragraph", this.includeInToc = function () {
				return !0
			}, this.getLevel = function () {
				return this.level
			}
		}, s.Prototype.prototype = i.prototype, s.prototype = new s.Prototype, s.prototype.constructor = s, o.defineProperties(s), e.exports = s
	}, {
		"../../../substance/document": 167,
		"../text/text_node": 109
	}],
	67: [function (t, e, n) {
		"use strict";
		var r = t("../node").View,
			o = t("../../../substance/application").$$,
			i = function (t, e) {
				r.call(this, t, e), this.$el.addClass("level-" + this.node.level)
			};
		i.Prototype = function () {
			this.render = function () {
				r.prototype.render.call(this);
				var t = this.createTextPropertyView([this.node.id, "content"], {
					classes: "title"
				});
				if (this.node.label) {
					var e = o(".label", {
						text: this.node.label
					});
					this.content.appendChild(e)
				}
				return this.content.appendChild(t.render().el), this
			}, this.renderTocItem = function () {
				var t = o("div");
				if (this.node.label) {
					var e = o(".label", {
						text: this.node.label
					});
					t.appendChild(e)
				}
				var n = o("span");
				return this.renderAnnotatedText([this.node.id, "content"], n), t.appendChild(n), t
			}
		}, i.Prototype.prototype = r.prototype, i.prototype = new i.Prototype, e.exports = i
	}, {
		"../../../substance/application": 154,
		"../node": 87
	}],
	68: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./heading"),
			View: t("./heading_view")
		}
	}, {
		"./heading": 66,
		"./heading_view": 67
	}],
	69: [function (t, e, n) {
		var r = (t("underscore"), t("../../../substance/document")),
			o = function (t, e) {
				r.Node.call(this, t, e)
			};
		o.type = {
			id: "html_table",
			parent: "content",
			properties: {
				source_id: "string",
				label: "string",
				content: "string",
				footers: ["array", "string"],
				caption: "caption"
			}
		}, o.config = {
			zoomable: !0
		}, o.description = {
			name: "HTMLTable",
			remarks: ["A table figure which is expressed in HTML notation"],
			properties: {
				source_id: "string",
				label: "Label shown in the resource header.",
				title: "Full table title",
				content: "HTML data",
				footers: "HTMLTable footers expressed as an array strings",
				caption: "References a caption node, that has all the content"
			}
		}, o.example = {
			id: "html_table_1",
			type: "html_table",
			label: "HTMLTable 1.",
			title: "Lorem ipsum table",
			content: "<table>...</table>",
			footers: [],
			caption: "caption_1"
		}, o.Prototype = function () {
			this.getCaption = function () {
				return this.properties.caption ? this.document.get(this.properties.caption) : void 0
			}, this.getHeader = function () {
				return this.properties.label
			}
		}, o.Prototype.prototype = r.Node.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, r.Node.defineProperties(o), e.exports = o
	}, {
		"../../../substance/document": 167,
		underscore: 124
	}],
	70: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../node").View,
			i = t("../../../substance/application").$$,
			s = t("../../resource_view"),
			a = function (t, e, n) {
				o.call(this, t, e), s.call(this, n)
			};
		a.Prototype = function () {
			r.extend(this, s.prototype), this.isZoomable = !0, this.renderBody = function () {
				var t = i(".table-wrapper", {
					html: this.node.content
				});
				this.content.appendChild(t);
				var e = i(".footers", {
					children: r.map(this.node.footers, function (t) {
						return i(".footer", {
							html: "<b>" + t.label + "</b> " + t.content
						})
					})
				});
				if (this.node.caption) {
					var n = this.createView(this.node.caption);
					this.content.appendChild(n.render().el)
				}
				this.content.appendChild(e)
			}
		}, a.Prototype.prototype = o.prototype, a.prototype = new a.Prototype, e.exports = a
	}, {
		"../../../substance/application": 154,
		"../../resource_view": 119,
		"../node": 87,
		underscore: 124
	}],
	71: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./html_table"),
			View: t("./html_table_view")
		}
	}, {
		"./html_table": 69,
		"./html_table_view": 70
	}],
	72: [function (t, e, n) {
		"use strict";
		var r = (t("../../../substance/document").Node, t("../web_resource").Model),
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.type = {
			id: "image",
			parent: "webresource",
			properties: {
				source_id: "string"
			}
		}, o.example = {
			type: "image",
			id: "image_1",
			url: "http://substance.io/image_1.png"
		}, o.description = {
			name: "Image",
			remarks: ["Represents a web-resource for an image."],
			properties: {}
		}, o.Prototype = function () {}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, e.exports = o
	}, {
		"../../../substance/document": 167,
		"../web_resource": 117
	}],
	73: [function (t, e, n) {
		"use strict";
		var r = t("../node").View,
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.Prototype = function () {
			var t = Array.prototype.indexOf;
			this.render = function () {
				var e = document.createElement("div");
				e.className = "content";
				var n = document.createElement("div");
				n.className = "image-char", this._imgChar = n;
				var r = document.createElement("img");
				return r.src = this.node.url, r.alt = "alt text", r.title = "alt text", n.appendChild(r), e.appendChild(n), this.el.appendChild(e), this._imgPos = t.call(n.childNodes, r), this
			}, this["delete"] = function (t, e) {
				for (var n = this.$(".content")[0], r = n.childNodes, o = e - 1; o >= 0; o--) n.removeChild(r[t + o])
			}, this.getCharPosition = function (t, e) {
				return t === this._imgChar ? e > this._imgPos ? 1 : 0 : void console.log("Errhhh..")
			}, this.getDOMPosition = function (t) {
				var e = this.$(".content")[0],
					n = document.createRange();
				return 0 === t ? n.setStartBefore(e.childNodes[0]) : n.setStartAfter(e.childNodes[0]), n
			}
		}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, e.exports = o
	}, {
		"../node": 87
	}],
	74: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./image"),
			View: t("./image_view")
		}
	}, {
		"./image": 72,
		"./image_view": 73
	}],
	75: [function (t, e, n) {
		"use strict";
		e.exports = {
			node: t("./node"),
			composite: t("./composite"),
			annotation: t("./annotation"),
			emphasis: t("./emphasis"),
			strong: t("./strong"),
			subscript: t("./subscript"),
			superscript: t("./superscript"),
			underline: t("./underline"),
			code: t("./code"),
			author_callout: t("./author_callout"),
			custom_annotation: t("./custom_annotation"),
			"inline-formula": t("./inline_formula"),
			resource_reference: t("./resource_reference"),
			contributor_reference: t("./contributor_reference"),
			figure_reference: t("./figure_reference"),
			citation_reference: t("./citation_reference"),
			definition_reference: t("./definition_reference"),
			cross_reference: t("./cross_reference"),
			publication_info: t("./publication_info"),
			link: t("./link"),
			inline_image: t("./inline_image"),
			document: t("./document"),
			text: t("./text"),
			paragraph: t("./paragraph"),
			heading: t("./heading"),
			box: t("./box"),
			cover: t("./cover"),
			figure: t("./figure"),
			caption: t("./caption"),
			image: t("./image"),
			webresource: t("./web_resource"),
			html_table: t("./html_table"),
			supplement: t("./supplement"),
			video: t("./video"),
			contributor: t("./contributor"),
			definition: t("./definition"),
			citation: t("./citation"),
			formula: t("./formula"),
			list: t("./list"),
			codeblock: t("./codeblock"),
			affiliation: t("./_affiliation"),
			footnote: t("./footnote")
		}
	}, {
		"./_affiliation": 8,
		"./annotation": 11,
		"./author_callout": 14,
		"./box": 17,
		"./caption": 20,
		"./citation": 23,
		"./citation_reference": 25,
		"./code": 27,
		"./codeblock": 30,
		"./composite": 32,
		"./contributor": 35,
		"./contributor_reference": 37,
		"./cover": 40,
		"./cross_reference": 42,
		"./custom_annotation": 45,
		"./definition": 48,
		"./definition_reference": 50,
		"./document": 52,
		"./emphasis": 54,
		"./figure": 57,
		"./figure_reference": 59,
		"./footnote": 62,
		"./formula": 65,
		"./heading": 68,
		"./html_table": 71,
		"./image": 74,
		"./inline_formula": 76,
		"./inline_image": 79,
		"./link": 81,
		"./list": 84,
		"./node": 87,
		"./paragraph": 90,
		"./publication_info": 93,
		"./resource_reference": 96,
		"./strong": 99,
		"./subscript": 101,
		"./superscript": 103,
		"./supplement": 105,
		"./text": 108,
		"./underline": 112,
		"./video": 114,
		"./web_resource": 117
	}],
	76: [function (t, e, n) {
		e.exports = {
			Model: t("./inline_formula.js"),
			View: t("./inline_formula_view.js")
		}
	}, {
		"./inline_formula.js": 77,
		"./inline_formula_view.js": 78
	}],
	77: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = t("../annotation/annotation"),
			i = function (t, e) {
				o.call(this, t, e)
			};
		i.type = {
			id: "inline-formula",
			parent: "annotation",
			properties: {
				target: "formula"
			}
		}, i.Prototype = function () {}, i.Prototype.prototype = o.prototype, i.prototype = new i.Prototype, i.prototype.constructor = i, i.fragmentation = o.NEVER, r.Node.defineProperties(i), e.exports = i
	}, {
		"../../../substance/document": 167,
		"../annotation/annotation": 9
	}],
	78: [function (t, e, n) {
		"use strict";
		var r = t("../resource_reference").View,
			o = function (t, e) {
				r.call(this, t, e), $(this.el).removeClass("resource-reference")
			};
		o.Prototype = function () {
			this.createElement = function () {
				var t = document.createElement("span");
				return t
			}, this.render = function () {
				var t = this.node.document.get(this.node.target),
					e = this.viewFactory.createView(t);
				return this.el.innerHTML = e.render().el.innerHTML, this
			}
		}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, e.exports = o
	}, {
		"../resource_reference": 96
	}],
	79: [function (t, e, n) {
		e.exports = {
			Model: t("./inline_image.js"),
			View: t("../annotation/annotation_view.js")
		}
	}, {
		"../annotation/annotation_view.js": 10,
		"./inline_image.js": 80
	}],
	80: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = t("../annotation/annotation"),
			i = function (t, e) {
				o.call(this, t, e)
			};
		i.type = {
			id: "inline-image",
			parent: "annotation",
			properties: {
				target: "image"
			}
		}, i.Prototype = function () {}, i.Prototype.prototype = o.prototype, i.prototype = new i.Prototype, i.prototype.constructor = i, i.fragmentation = o.NEVER, r.Node.defineProperties(i), e.exports = i
	}, {
		"../../../substance/document": 167,
		"../annotation/annotation": 9
	}],
	81: [function (t, e, n) {
		e.exports = {
			Model: t("./link.js"),
			View: t("./link_view.js")
		}
	}, {
		"./link.js": 82,
		"./link_view.js": 83
	}],
	82: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = t("../annotation/annotation"),
			i = function (t, e) {
				o.call(this, t, e)
			};
		i.type = {
			id: "link",
			parent: "annotation",
			properties: {
				url: "string"
			}
		}, i.Prototype = function () {}, i.Prototype.prototype = o.prototype, i.prototype = new i.Prototype, i.prototype.constructor = i, i.fragmentation = o.NEVER, r.Node.defineProperties(i), e.exports = i
	}, {
		"../../../substance/document": 167,
		"../annotation/annotation": 9
	}],
	83: [function (t, e, n) {
		var r = t("../annotation").View,
			o = function (t) {
				r.call(this, t)
			};
		o.Prototype = function () {
			this.createElement = function () {
				var t = document.createElement("a");
				return t.setAttribute("href", this.node.url), t.setAttribute("target", "_blank"), t
			}, this.setClasses = function () {
				this.$el.addClass("link")
			}
		}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, e.exports = o
	}, {
		"../annotation": 11
	}],
	84: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./list"),
			View: t("./list_view")
		}
	}, {
		"./list": 85,
		"./list_view": 86
	}],
	85: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../../../substance/document"),
			i = o.Node,
			s = o.Composite,
			a = function (t, e) {
				s.call(this, t, e)
			};
		a.type = {
			id: "list",
			parent: "content",
			properties: {
				source_id: "string",
				items: ["array", "paragraph"],
				ordered: "boolean"
			}
		}, a.description = {
			name: "List",
			remarks: ["Lists can either be numbered or bullet lists"],
			properties: {
				ordered: "Specifies wheter the list is ordered or not",
				items: "An array of paragraph references"
			}
		}, a.example = {
			type: "list",
			id: "list_1",
			"items ": ["paragraph_listitem_1", "paragraph_listitem_2"]
		}, a.Prototype = function () {
			this.getLength = function () {
				return this.properties.items.length
			}, this.getChildrenIds = function () {
				return r.clone(this.items)
			}, this.getItems = function () {
				return r.map(this.properties.items, function (t) {
					return this.document.get(t)
				}, this)
			}, this.getChangePosition = function (t) {
				if ("items" === t.path[1])
					if ("update" === t.type) {
						var e = t.diff;
						if (e.isInsert()) return t.diff.pos + 1;
						if (e.isDelete()) return t.diff.pos;
						if (e.isMove()) return t.diff.target
					} else if ("set" === t.type) return this.properties.items.length - 1;
				return -1
			}, this.isMutable = function () {
				return !0
			}, this.insertChild = function (t, e, n) {
				t.update([this.id, "items"], ["+", e, n])
			}, this.deleteChild = function (t, e) {
				var n = this.items.indexOf(e);
				t.update([this.id, "items"], ["-", n, e]), t["delete"](e)
			}, this.canJoin = function (t) {
				return "list" === t.type
			}, this.isBreakable = function () {
				return !0
			}, this["break"] = function (t, e, n) {
				var r = this.properties.items.indexOf(e);
				if (0 > r) throw new Error("Unknown child " + e);
				var o = t.get(e),
					i = o["break"](t, n);
				return t.update([this.id, "items"], ["+", r + 1, i.id]), i
			}
		}, a.Prototype.prototype = s.prototype, a.prototype = new a.Prototype, a.prototype.constructor = a, i.defineProperties(a.prototype, ["items", "ordered"]), e.exports = a
	}, {
		"../../../substance/document": 167,
		underscore: 124
	}],
	86: [function (t, e, n) {
		"use strict";
		var r = t("../composite/composite_view"),
			o = t("./list"),
			i = function (t, e) {
				r.call(this, t, e)
			};
		i.whoami = "SubstanceListView", i.Prototype = function () {
			this.render = function () {
				this.el.innerHTML = "";
				var t = this.node.ordered ? "OL" : "UL";
				this.content = document.createElement(t), this.content.classList.add("content");
				var e;
				for (e = 0; e < this.childrenViews.length; e++) this.childrenViews[e].dispose();
				var n = this.node.getNodes();
				for (e = 0; e < n.length; e++) {
					var r, i = this.node.document.get(n[e]),
						s = this.viewFactory.createView(i);
					i instanceof o ? r = s.render().el : (r = document.createElement("LI"), r.appendChild(s.render().el)), this.content.appendChild(r), this.childrenViews.push(s)
				}
				return this.el.appendChild(this.content), this
			}, this.onNodeUpdate = function (t) {
				t.path[0] === this.node.id && "items" === t.path[1] && this.render()
			}
		}, i.Prototype.prototype = r.prototype, i.prototype = new i.Prototype, e.exports = i
	}, {
		"../composite/composite_view": 31,
		"./list": 85
	}],
	87: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./node"),
			View: t("./node_view")
		}
	}, {
		"./node": 88,
		"./node_view": 89
	}],
	88: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/document"),
			o = r.Node;
		o.description = {
			name: "Node",
			remarks: ["Abstract node type."],
			properties: {
				source_id: "Useful for document conversion where the original id of an element should be remembered."
			}
		}, e.exports = o
	}, {
		"../../../substance/document": 167
	}],
	89: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/application").View,
			o = t("../text/text_property_view"),
			i = function (t, e, n) {
				if (r.call(this, n), this.node = t, this.viewFactory = e, !e) throw new Error('Illegal argument. Argument "viewFactory" is mandatory.');
				this.$el.addClass("content-node").addClass(t.type.replace("_", "-")), this.el.dataset.id = this.node.id
			};
		i.Prototype = function () {
			this.render = function () {
				return this.content = document.createElement("DIV"), this.content.classList.add("content"), this.focusHandle = document.createElement("DIV"), this.focusHandle.classList.add("focus-handle"), this.el.appendChild(this.content), this.el.appendChild(this.focusHandle), this
			}, this.dispose = function () {
				this.stopListening()
			}, this.createView = function (t) {
				var e = this.node.document.get(t),
					n = this.viewFactory.createView(e);
				return n
			}, this.createTextView = function (t) {
				console.error("FIXME: NodeView.createTextView() is deprecated. Use NodeView.createTextPropertyView() instead.");
				var e = this.viewFactory.createView(this.node, t, "text");
				return e
			}, this.createTextPropertyView = function (t, e) {
				var n = new o(this.node.document, t, this.viewFactory, e);
				return n
			}, this.renderAnnotatedText = function (t, e) {
				var n = this.node.document.resolve(t),
					r = o.renderAnnotatedText(this.node.document, n, e, this.viewFactory);
				return r
			}
		}, i.Prototype.prototype = r.prototype, i.prototype = new i.Prototype, e.exports = i
	}, {
		"../../../substance/application": 154,
		"../text/text_property_view": 110
	}],
	90: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./paragraph"),
			View: t("./paragraph_view")
		}
	}, {
		"./paragraph": 91,
		"./paragraph_view": 92
	}],
	91: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../../../substance/document"),
			i = o.Node,
			s = o.Composite,
			a = function (t, e) {
				s.call(this, t, e)
			};
		a.type = {
			id: "paragraph",
			parent: "content",
			properties: {
				children: ["array", "content"]
			}
		}, a.description = {
			name: "Paragraph",
			remarks: ["A Paragraph can have inline elements such as images."],
			properties: {
				children: "An array of content node references"
			}
		}, a.example = {
			type: "paragraph",
			id: "paragraph_1",
			"children ": ["text_1", "image_1", "text_2"]
		}, a.Prototype = function () {
			this.getLength = function () {
				return this.properties.children.length
			}, this.getChildrenIds = function () {
				return r.clone(this.properties.children)
			}, this.getChildren = function () {
				return r.map(this.properties.children, function (t) {
					return this.document.get(t)
				}, this)
			}
		}, a.Prototype.prototype = s.prototype, a.prototype = new a.Prototype, a.prototype.constructor = a, i.defineProperties(a.prototype, ["children"]), e.exports = a
	}, {
		"../../../substance/document": 167,
		underscore: 124
	}],
	92: [function (t, e, n) {
		"use strict";
		var r = t("../composite/composite_view"),
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.Prototype = function () {}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, e.exports = o
	}, {
		"../composite/composite_view": 31
	}],
	93: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./publication_info"),
			View: t("./publication_info_view")
		}
	}, {
		"./publication_info": 94,
		"./publication_info_view": 95
	}],
	94: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/document"),
			o = function (t, e) {
				r.Node.call(this, t, e)
			};
		o.type = {
			id: "publication_info",
			parent: "content",
			properties: {
				history: ["array", "object"],
				published_on: "string",
				published_on_month_year: "string",
				journal: "string",
				provider: "string",
				article_type: "string",
				keywords: ["array", "string"],
				research_organisms: ["array", "string"],
				subjects: ["array", "string"],
				links: ["array", "objects"],
				doi: "string",
				related_article: "string",
				article_info: "paragraph"
			}
		}, o.description = {
			name: "PublicationInfo",
			description: "PublicationInfo Node",
			remarks: ["Summarizes the article's meta information. Meant to be customized by publishers"],
			properties: {
				received_on: "Submission received",
				accepted_on: "Paper accepted on",
				published_on: "Paper published on",
				history: "History of the submission cycle",
				journal: "The Journal",
				provider: "Who is hosting this article",
				article_type: "Research Article vs. Insight, vs. Correction etc.",
				keywords: "Article's keywords",
				research_organisms: "Research Organisms",
				subjects: "Article Subjects",
				doi: "Article DOI",
				related_article: "DOI of related article if there is any"
			}
		}, o.example = {
			id: "publication_info",
			published_on: "2012-11-13",
			published_on: "2012-11",
			history: [{
				type: "received",
				date: "2012-06-20"
			}, {
				type: "accepted",
				date: "2012-09-05"
			}],
			journal: "eLife",
			provider: "eLife",
			article_type: "Research Article",
			keywords: ["innate immunity", "histones", "lipid droplet", "anti-bacterial"],
			research_organisms: ["B. subtilis", "D. melanogaster", "E. coli", "Mouse"],
			subjects: ["Immunology", "Microbiology and infectious disease"],
			doi: "http://dx.doi.org/10.7554/eLife.00003"
		}, o.Prototype = function () {
			this.getArticleInfo = function () {
				return this.document.get("articleinfo")
			}
		}, o.Prototype.prototype = r.Node.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, r.Node.defineProperties(o), e.exports = o
	}, {
		"../../../substance/document": 167
	}],
	95: [function (t, e, n) {
		"use strict";
		var r = t("../node").View,
			o = t("../../../substance/application").$$,
			i = t("../../article_util"),
			s = {
				received: "received",
				accepted: "accepted",
				revised: "revised",
				corrected: "corrected",
				"rev-recd": "revised",
				"rev-request": "returned for modification",
				published: "published",
				"default": "updated"
			},
			a = function (t, e) {
				r.call(this, t, e)
			};
		a.Prototype = function () {
			this.render = function () {
				r.prototype.render.call(this);
				var t = o(".meta-data");
				if (this.node.article_type) {
					var e = o(".article-type.container", {
						children: [o("div.label", {
							text: "Article Type"
						}), o("div.value", {
							text: this.node.article_type
						})]
					});
					t.appendChild(e)
				}
				if (this.node.subjects && this.node.subjects.length > 0) {
					var n = o(".subject.container", {
						children: [o("div.label", {
							text: "Subject"
						}), o("div.value", {
							text: this.node.subjects.join(", ")
						})]
					});
					t.appendChild(n)
				}
				if (this.node.research_organisms && this.node.research_organisms.length > 0) {
					var i = o(".subject.container", {
						children: [o("div.label", {
							text: "Organism"
						}), o("div.value", {
							text: this.node.research_organisms.join(", ")
						})]
					});
					t.appendChild(i)
				}
				if (this.node.keywords && this.node.keywords.length > 0) {
					var s = o(".keywords.container", {
						children: [o("div.label", {
							text: "Keywords"
						}), o("div.value", {
							text: this.node.keywords.join(", ")
						})]
					});
					t.appendChild(s)
				}
				if (this.node.doi) {
					var a = o(".doi.container", {
						children: [o("div.label", {
							text: "DOI"
						}), o("div.value", {
							children: [o("a", {
								href: "http://dx.doi.org/" + this.node.doi,
								text: this.node.doi,
								target: "_blank"
							})]
						})]
					});
					t.appendChild(a)
				}
				if (this.node.related_article) {
					var c = o(".related-article.container", {
						children: [o("div.label", {
							text: "Related Article"
						}), o("div.value", {
							children: [o("a", {
								href: this.node.related_article,
								text: this.node.related_article
							})]
						})]
					});
					t.appendChild(c)
				}
				var u = this.describePublicationHistory();
				t.appendChild(u), this.content.appendChild(t);
				var l = this.node.getArticleInfo(),
					p = this.viewFactory.createView(l),
					h = p.render().el;
				return this.content.appendChild(h), this
			}, this.describePublicationHistory = function () {
				var t, e = o(".dates"),
					n = [];
				if (this.node.history && this.node.history.length > 0 && (n = n.concat(this.node.history)), this.node.published_on && n.push({
						type: "published",
						date: this.node.published_on
					}), n.length > 0) {
					for (e.appendChild(document.createTextNode("The article was ")), t = 0; t < n.length; t++) {
						t > 0 && (e.appendChild(document.createTextNode(", ")), t === n.length - 1 && e.appendChild(document.createTextNode("and ")));
						var r = n[t];
						e.appendChild(document.createTextNode((s[r.type] || s["default"]) + " on ")), e.appendChild(o("b", {
							text: i.formatDate(r.date)
						}))
					}
					e.appendChild(document.createTextNode("."))
				}
				return e
			}, this.dispose = function () {
				r.prototype.dispose.call(this)
			}
		}, a.Prototype.prototype = r.prototype, a.prototype = new a.Prototype, e.exports = a
	}, {
		"../../../substance/application": 154,
		"../../article_util": 5,
		"../node": 87
	}],
	96: [function (t, e, n) {
		e.exports = {
			Model: t("./resource_reference.js"),
			View: t("./resource_reference_view.js")
		}
	}, {
		"./resource_reference.js": 97,
		"./resource_reference_view.js": 98
	}],
	97: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = t("../annotation/annotation"),
			i = function (t, e) {
				o.call(this, t, e)
			};
		i.type = {
			id: "resource_reference",
			parent: "annotation",
			properties: {
				target: "node"
			}
		}, i.Prototype = function () {}, i.Prototype.prototype = o.prototype, i.prototype = new i.Prototype, i.prototype.constructor = i, i.fragmentation = o.NEVER, r.Node.defineProperties(i), e.exports = i
	}, {
		"../../../substance/document": 167,
		"../annotation/annotation": 9
	}],
	98: [function (t, e, n) {
		"use strict";
		var r = t("../annotation/annotation_view"),
			o = function (t, e) {
				r.call(this, t, e), this.$el.addClass("resource-reference")
			};
		o.Prototype = function () {
			this.createElement = function () {
				var t = document.createElement("a");
				return t.setAttribute("href", ""), t
			}
		}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, e.exports = o
	}, {
		"../annotation/annotation_view": 10
	}],
	99: [function (t, e, n) {
		e.exports = {
			Model: t("./strong.js"),
			View: t("../annotation/annotation_view.js")
		}
	}, {
		"../annotation/annotation_view.js": 10,
		"./strong.js": 100
	}],
	100: [function (t, e, n) {
		var r = t("../annotation/annotation"),
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.type = {
			id: "strong",
			parent: "annotation",
			properties: {}
		}, o.Prototype = function () {}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, o.fragmentation = r.DONT_CARE, e.exports = o
	}, {
		"../annotation/annotation": 9
	}],
	101: [function (t, e, n) {
		e.exports = {
			Model: t("./subscript.js"),
			View: t("../annotation/annotation_view.js")
		}
	}, {
		"../annotation/annotation_view.js": 10,
		"./subscript.js": 102
	}],
	102: [function (t, e, n) {
		var r = t("../annotation/annotation"),
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.type = {
			id: "subscript",
			parent: "annotation",
			properties: {}
		}, o.Prototype = function () {}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, o.fragmentation = r.DONT_CARE, e.exports = o
	}, {
		"../annotation/annotation": 9
	}],
	103: [function (t, e, n) {
		e.exports = {
			Model: t("./superscript.js"),
			View: t("../annotation/annotation_view.js")
		}
	}, {
		"../annotation/annotation_view.js": 10,
		"./superscript.js": 104
	}],
	104: [function (t, e, n) {
		var r = t("../annotation/annotation"),
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.type = {
			id: "superscript",
			parent: "annotation",
			properties: {}
		}, o.Prototype = function () {}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, o.fragmentation = r.DONT_CARE, e.exports = o
	}, {
		"../annotation/annotation": 9
	}],
	105: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./supplement"),
			View: t("./supplement_view")
		}
	}, {
		"./supplement": 106,
		"./supplement_view": 107
	}],
	106: [function (t, e, n) {
		var r = (t("underscore"), t("../../../substance/document")),
			o = function (t, e) {
				r.Composite.call(this, t, e)
			};
		o.type = {
			id: "supplement",
			parent: "content",
			properties: {
				source_id: "string",
				label: "string",
				url: "string",
				caption: "caption"
			}
		}, o.description = {
			name: "Supplement",
			remarks: ["A Supplement entity."],
			properties: {
				source_id: "Supplement id as it occurs in the source NLM file",
				label: "Supplement label",
				caption: "References a caption node, that has all the content",
				url: "URL of downloadable file"
			}
		}, o.example = {
			id: "supplement_1",
			source_id: "SD1-data",
			type: "supplement",
			label: "Supplementary file 1.",
			url: "http://myserver.com/myfile.pdf",
			caption: "caption_supplement_1"
		}, o.Prototype = function () {
			this.getChildrenIds = function () {
				var t = [];
				return this.properties.caption && t.push(this.properties.caption), t
			}, this.getCaption = function () {
				return this.properties.caption ? this.document.get(this.properties.caption) : null
			}, this.getHeader = function () {
				return this.properties.label
			}
		}, o.Prototype.prototype = r.Composite.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, r.Node.defineProperties(o), e.exports = o
	}, {
		"../../../substance/document": 167,
		underscore: 124
	}],
	107: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../composite").View,
			i = t("../../../substance/application").$$,
			s = t("../../resource_view"),
			a = function (t, e, n) {
				o.call(this, t, e), s.call(this, n)
			};
		a.Prototype = function () {
			r.extend(this, s.prototype), this.renderBody = function () {
				this.renderChildren();
				var t = i("div.file", {
					children: [i("a", {
						href: this.node.url,
						html: '<i class="fa fa-download"/> Download'
					})]
				});
				this.content.appendChild(t)
			}
		}, a.Prototype.prototype = o.prototype, a.prototype = new a.Prototype, a.prototype.constructor = a, e.exports = a
	}, {
		"../../../substance/application": 154,
		"../../resource_view": 119,
		"../composite": 32,
		underscore: 124
	}],
	108: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./text_node"),
			View: t("./text_view")
		}
	}, {
		"./text_node": 109,
		"./text_view": 111
	}],
	109: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/document");
		e.exports = r.TextNode
	}, {
		"../../../substance/document": 167
	}],
	110: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/util"),
			o = r.Fragmenter,
			i = t("../../../substance/application").View,
			s = function (t, e, n, r) {
				r = r || {}, r.elementType = r.elementType || "span", i.call(this, r), this.path = e, this.document = t, this.viewFactory = n, this.options = r || {}, this.property = t.resolve(this.path), this.$el.addClass("text"), this.options.classes && this.$el.addClass(this.options.classes)
			};
		s.Prototype = function () {
			this.render = function () {
				return this.el.innerHTML = "", s.renderAnnotatedText(this.document, this.property, this.el, this.viewFactory), this
			}, this.dispose = function () {
				this.stopListening()
			}, this.renderWithAnnotations = function (t) {
				var e = this,
					n = this.property.get(),
					r = document.createDocumentFragment(),
					i = this.document,
					s = [],
					a = new o;
				a.onText = function (t, e) {
					t.appendChild(document.createTextNode(e))
				}, a.onEnter = function (t, n) {
					var r = i.get(t.id),
						o = e.viewFactory.createView(r);
					return n.appendChild(o.el), s.push(o), o.el
				}, a.start(r, n, t);
				for (var c = 0; c < s.length; c++) s[c].render();
				this.el.innerHTML = "", this.el.appendChild(r)
			}
		}, s.Prototype.prototype = i.prototype, s.prototype = new s.Prototype, s.renderAnnotatedText = function (t, e, n, r) {
			var i = window.document.createDocumentFragment(),
				s = e.get(),
				a = t.getIndex("annotations").get(e.path),
				c = [],
				u = new o;
			u.onText = function (t, e) {
				t.appendChild(window.document.createTextNode(e))
			}, u.onEnter = function (e, n) {
				var o = t.get(e.id),
					i = r.createView(o);
				return n.appendChild(i.el), c.push(i), i.el
			}, u.start(i, s, a);
			for (var l = 0; l < c.length; l++) c[l].render();
			n.appendChild(i)
		}, e.exports = s
	}, {
		"../../../substance/application": 154,
		"../../../substance/util": 175
	}],
	111: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/util"),
			o = r.Fragmenter,
			i = t("../node/node_view"),
			s = t("../../../substance/application").$$,
			a = function (t, e, n) {
				i.call(this, t, e), n = this.options = n || {}, this.path = n.path || [t.id, "content"], this.property = t.document.resolve(this.path), this.$el.addClass("text"), n.classes && this.$el.addClass(n.classes), n.path && this.$el.removeClass("content-node"), this._annotations = {}
			};
		a.Prototype = function () {
			this.render = function () {
				return i.prototype.render.call(this), this.renderContent(), this
			}, this.dispose = function () {
				i.prototype.dispose.call(this)
			}, this.renderContent = function () {
				this.content.innerHTML = "", this._annotations = this.node.document.getIndex("annotations").get(this.path), this.renderWithAnnotations(this._annotations)
			}, this.createAnnotationElement = function (t) {
				if (this.options.createAnnotationElement) return this.options.createAnnotationElement.call(this, t);
				var e;
				return e = "link" === t.type ? s("a.annotation." + t.type, {
					id: t.id,
					href: this.node.document.get(t.id).url
				}) : s("span.annotation." + t.type, {
					id: t.id
				})
			}, this.renderWithAnnotations = function (t) {
				var e = this,
					n = this.property.get(),
					r = document.createDocumentFragment(),
					i = this.node.document,
					s = [],
					a = new o;
				a.onText = function (t, e) {
					t.appendChild(document.createTextNode(e))
				}, a.onEnter = function (t, n) {
					var r = i.get(t.id),
						o = e.viewFactory.createView(r);
					return n.appendChild(o.el), s.push(o), o.el
				}, a.start(r, n, t);
				for (var c = 0; c < s.length; c++) s[c].render();
				this.content.innerHTML = "", this.content.appendChild(r)
			}
		}, a.Prototype.prototype = i.prototype, a.prototype = new a.Prototype, e.exports = a
	}, {
		"../../../substance/application": 154,
		"../../../substance/util": 175,
		"../node/node_view": 89
	}],
	112: [function (t, e, n) {
		e.exports = {
			Model: t("./underline.js"),
			View: t("../annotation/annotation_view.js")
		}
	}, {
		"../annotation/annotation_view.js": 10,
		"./underline.js": 113
	}],
	113: [function (t, e, n) {
		var r = t("../annotation/annotation"),
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.type = {
			id: "underline",
			parent: "annotation",
			properties: {}
		}, o.Prototype = function () {}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, o.fragmentation = r.DONT_CARE, e.exports = o
	}, {
		"../annotation/annotation": 9
	}],
	114: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./video"),
			View: t("./video_view")
		}
	}, {
		"./video": 115,
		"./video_view": 116
	}],
	115: [function (t, e, n) {
		var r = t("../../../substance/document"),
			o = function (t, e) {
				r.Node.call(this, t, e)
			};
		o.type = {
			id: "video",
			parent: "content",
			properties: {
				source_id: "string",
				label: "string",
				url: "string",
				url_webm: "string",
				url_ogv: "string",
				caption: "caption",
				poster: "string"
			}
		}, o.config = {
			zoomable: !0
		}, o.description = {
			name: "Video",
			remarks: ["A video type intended to refer to video resources.", "MP4, WebM and OGV formats are supported."],
			properties: {
				label: "Label shown in the resource header.",
				url: "URL to mp4 version of the video.",
				url_webm: "URL to WebM version of the video.",
				url_ogv: "URL to OGV version of the video.",
				poster: "Video poster image.",
				caption: "References a caption node, that has all the content"
			}
		}, o.example = {
			id: "video_1",
			type: "video",
			label: "Video 1.",
			url: "http://cdn.elifesciences.org/video/eLifeLensIntro2.mp4",
			url_webm: "http://cdn.elifesciences.org/video/eLifeLensIntro2.webm",
			url_ogv: "http://cdn.elifesciences.org/video/eLifeLensIntro2.ogv",
			poster: "http://cdn.elifesciences.org/video/eLifeLensIntro2.png",
			caption: "caption_25"
		}, o.Prototype = function () {
			this.getHeader = function () {
				return this.properties.label
			}, this.getCaption = function () {
				return this.properties.caption ? this.document.get(this.properties.caption) : ""
			}
		}, o.Prototype.prototype = r.Node.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, r.Node.defineProperties(o), e.exports = o
	}, {
		"../../../substance/document": 167
	}],
	116: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../../../substance/application").$$,
			i = t("../node").View,
			s = t("../../resource_view"),
			a = function (t, e, n) {
				i.call(this, t, e), s.call(this, n)
			};
		a.Prototype = function () {
			r.extend(this, s.prototype), this.isZoomable = !0, this.renderBody = function () {
				var t = this.node,
					e = [o("source", {
						src: t.url,
						type: "video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;"
					})];
				t.url_ogv && e.push(o("source", {
					src: t.url_ogv,
					type: "video/ogg; codecs=&quot;theora, vorbis&quot;"
				})), t.url_webm && e.push(o("source", {
					src: t.url_webm,
					type: "video/webm"
				}));
				var n = o(".video-wrapper", {
					children: [o("video", {
						controls: "controls",
						poster: t.poster,
						preload: "none",
						children: e
					})]
				});
				if (this.content.appendChild(n), t.title && this.content.appendChild(o(".title", {
						text: t.title
					})), this.node.caption) {
					var r = this.createView(this.node.caption);
					this.content.appendChild(r.render().el), this.captionView = r
				}
				t.doi && this.content.appendChild(o(".doi", {
					children: [o("b", {
						text: "DOI: "
					}), o("a", {
						href: t.doi,
						target: "_new",
						text: t.doi
					})]
				}))
			}
		}, a.Prototype.prototype = i.prototype, a.prototype = new a.Prototype, e.exports = a
	}, {
		"../../../substance/application": 154,
		"../../resource_view": 119,
		"../node": 87,
		underscore: 124
	}],
	117: [function (t, e, n) {
		"use strict";
		e.exports = {
			Model: t("./web_resource"),
			View: t("../node").View
		}
	}, {
		"../node": 87,
		"./web_resource": 118
	}],
	118: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/document"),
			o = r.Node,
			i = function (t, e) {
				o.call(this, t, e)
			};
		i.type = {
			id: "webresource",
			parent: "content",
			properties: {
				source_id: "string",
				url: "string"
			}
		}, i.description = {
			name: "WebResource",
			description: "A resource which can be accessed via URL",
			remarks: ["This element is a parent for several other nodes such as Image."],
			properties: {
				url: "URL to a resource"
			}
		}, i.example = {
			type: "webresource",
			id: "webresource_3",
			url: "http://elife.elifesciences.org/content/elife/1/e00311/F3.medium.gif"
		}, i.Prototype = function () {}, i.Prototype.prototype = o.prototype, i.prototype = new i.Prototype, i.prototype.constructor = i, o.defineProperties(i.prototype, ["url"]), e.exports = i
	}, {
		"../../../substance/document": 167
	}],
	119: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("./nodes/node").View,
			i = t("../substance/application").$$,
			s = {
				header: !1,
				zoom: !1
			},
			a = function (t) {
				this.options = r.extend({}, s, t)
			};
		a.Prototype = function () {
			this.isResourceView = !0, this.render = function () {
				return o.prototype.render.call(this), this.renderHeader(), this.renderBody(), this
			}, this.renderHeader = function () {
				this.node;
				if (this.options.header) {
					var t = i(".resource-header");
					t.appendChild(this.renderLabel());
					var e = i(".toggles");
					this.options.zoom && e.appendChild(i("a.toggle.toggle-fullscreen", {
						href: "#",
						html: '<i class="fa fa-expand"></i> Fullscreen'
					})), e.appendChild(i("a.toggle-res.toggle.action-toggle-resource", {
						href: "#",
						html: '<i class="fa fa-eye"></i> Focus'
					})), t.appendChild(e), this.headerEl = t, this.el.insertBefore(t, this.content)
				}
			}, this.renderLabel = function () {
				var t = i("div.name", {
					html: this.getHeader()
				});
				return t
			}, this.renderBody = function () {}, this.getHeader = function () {
				return this.node.getHeader()
			}
		}, a.prototype = new a.Prototype, e.exports = a
	}, {
		"../substance/application": 154,
		"./nodes/node": 87,
		underscore: 124
	}],
	120: [function (t, e, n) {
		var r = function (t, e) {
			this.nodeTypes = t, this.options = e || {}
		};
		r.Prototype = function () {
			this.getNodeViewClass = function (t, e) {
				e = e || t.type;
				var n = this.nodeTypes[e];
				if (!n) throw new Error("No node registered for type " + e + ".");
				var r = n.View;
				if (!r) throw new Error('No view registered for type "' + t.type + '".');
				return r
			}, this.createView = function (t, e, n) {
				var r = this.getNodeViewClass(t, n),
					o = new r(t, this, e);
				return o
			}
		}, r.prototype = new r.Prototype, e.exports = r
	}, {}],
	121: [function (t, e, n) {
		"use strict";
		var r = t("../substance/util"),
			o = t("underscore"),
			i = t("lens/converter"),
			s = function (t) {
				i.call(this, t)
			};
		s.Prototype = function () {
			var t = i.prototype;
			this.test = function (t, e) {
				var n = t.querySelector("publisher-name").textContent;
				return "eLife Sciences Publications, Ltd" === n
			}, this.__ignoreCustomMetaNames = ["elife-xml-version"], this.enhanceArticle = function (t, e) {
				var n, o, i = [],
					s = t.doc,
					a = e.querySelector("#SA1");
				a && (n = {
					id: t.nextId("heading"),
					type: "heading",
					level: 1,
					content: "Article Commentary"
				}, s.create(n), i.push(n), n = {
					id: t.nextId("heading"),
					type: "heading",
					level: 2,
					content: "Decision letter"
				}, s.create(n), i.push(n), o = a.querySelector("body"), i = i.concat(this.bodyNodes(t, r.dom.getChildren(o))));
				var c = e.querySelector("#SA2");
				c && (n = {
					id: t.nextId("heading"),
					type: "heading",
					level: 2,
					content: "Author response"
				}, s.create(n), i.push(n), o = c.querySelector("body"), i = i.concat(this.bodyNodes(t, r.dom.getChildren(o)))), i.length > 0 && this.show(t, i)
			}, this.enhanceCover = function (t, e, n) {
				var r, o = n.querySelector("subj-group[subj-group-type=display-channel] subject").textContent;
				try {
					r = n.querySelector("subj-group[subj-group-type=heading] subject").textContent
				} catch (i) {
					r = null
				}
				e.breadcrumbs = [{
					name: "eLife",
					url: "http://elifesciences.org/",
					image: "http://lens.elifesciences.org/lens-elife/styles/elife.png"
				}, {
					name: o,
					url: "http://elifesciences.org/category/" + o.replace(/ /g, "-").toLowerCase()
				}], r && e.breadcrumbs.push({
					name: r,
					url: "http://elifesciences.org/category/" + r.replace(/ /g, "-").toLowerCase()
				})
			}, this.enhanceFigure = function (t, e, n) {
				var r = n.querySelector("graphic"),
					o = r.getAttribute("xlink:href");
				e.url = this.resolveURL(t, o)
			}, this.resolveURL = function (t, e) {
				if (e.match(/http:\/\//)) return e;
				var n = this.getBaseURL(t);
				return n ? [n, e].join("") : ["http://cdn.elifesciences.org/elife-articles/", t.doc.id, "/jpg/", e, ".jpg"].join("")
			}, this.enhanceSupplement = function (t, e) {
				var n = this.getBaseURL(t);
				return n ? [n, e.url].join("") : void(e.url = ["http://cdn.elifesciences.org/elife-articles/", t.doc.id, "/suppl/", e.url].join(""))
			}, this.enhancePublicationInfo = function (t) {
				var e = t.xmlDoc.querySelector("article"),
					n = e.querySelector("article-meta"),
					r = t.doc.get("publication_info"),
					i = n.querySelectorAll("kwd-group[kwd-group-type=research-organism] kwd"),
					s = n.querySelectorAll("kwd-group[kwd-group-type=author-keywords] kwd"),
					a = n.querySelectorAll("subj-group[subj-group-type=heading] subject"),
					c = n.querySelector("subj-group[subj-group-type=display-channel] subject"),
					u = e.querySelector("self-uri[content-type=pdf]"),
					l = ["http://cdn.elifesciences.org/elife-articles/", t.doc.id, "/pdf/", u ? u.getAttribute("xlink:href") : "#"].join(""),
					p = [];
				l && p.push({
					url: l,
					name: "PDF",
					type: "pdf"
				}), p.push({
					url: "https://s3.amazonaws.com/elife-cdn/elife-articles/" + t.doc.id + "/elife" + t.doc.id + ".xml",
					name: "Source XML",
					type: "xml"
				}), p.push({
					url: "",
					name: "Lens JSON",
					type: "json"
				}), r.research_organisms = o.pluck(i, "textContent"), r.keywords = o.pluck(s, "textContent"), r.subjects = o.pluck(a, "textContent"), r.article_type = c ? c.textContent : "", r.links = p, r.related_article && (r.related_article = "http://dx.doi.org/" + r.related_article)
			}, this.enhanceSupplement = function (t, e) {
				var n = this.getBaseURL(t);
				return n ? [n, e.url].join("") : void(e.url = ["http://cdn.elifesciences.org/elife-articles/", t.doc.id, "/suppl/", e.url].join(""))
			}, this.enhanceVideo = function (t, e, n) {
				var r = n.getAttribute("xlink:href").split("."),
					o = r[0];
				e.url = "http://api.elifesciences.org/v2/articles/" + t.doc.id + "/media/file/" + o + ".mp4", e.url_ogv = "http://api.elifesciences.org/v2/articles/" + t.doc.id + "/media/file//" + o + ".ogv", e.url_webm = "http://api.elifesciences.org/v2/articles/" + t.doc.id + "/media/file//" + o + ".webm", e.poster = "http://api.elifesciences.org/v2/articles/" + t.doc.id + "/media/file/" + o + ".jpg"
			}, this.resolveURL = function (t, e) {
				if (e.match(/http:\/\//)) return e;
				var n = this.getBaseURL(t);
				return n ? [n, e].join("") : ["http://cdn.elifesciences.org/elife-articles/", t.doc.id, "/jpg/", e, ".jpg"].join("")
			};
			var e = /author-callout-style/;
			this.enhanceAnnotationData = function (t, n, r, o) {
				if ("named-content" === o) {
					var i = r.getAttribute("content-type");
					e.test(i) && (n.type = "author_callout", n.style = i)
				}
			}, this.showNode = function (e, n) {
				switch (n.type) {
					case "box":
						n.label && e.doc.show("figures", n.id);
						break;
					default:
						t.showNode.apply(this, arguments)
				}
			}
		}, s.Prototype.prototype = i.prototype, s.prototype = new s.Prototype, s.prototype.constructor = s, e.exports = s
	}, {
		"../substance/util": 175,
		"lens/converter": 122,
		underscore: 124
	}],
	122: [function (t, e, n) {
		"use strict";
		var r = t("./lens_converter");
		e.exports = r
	}, {
		"./lens_converter": 123
	}],
	123: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../substance/util"),
			i = o.errors,
			s = i.define("ImporterError"),
			a = t("../article"),
			c = function (t) {
				this.options = t || c.DefaultOptions
			};
		c.Prototype = function () {
			this._annotationTypes = {
				bold: "strong",
				italic: "emphasis",
				monospace: "code",
				sub: "subscript",
				sup: "superscript",
				sc: "custom_annotation",
				underline: "underline",
				"ext-link": "link",
				xref: "",
				email: "link",
				"named-content": "",
				"inline-formula": "inline-formula",
				uri: "link"
			}, this._refTypeMapping = {
				bibr: "citation_reference",
				fig: "figure_reference",
				table: "figure_reference",
				"supplementary-material": "figure_reference",
				other: "figure_reference",
				list: "definition_reference"
			}, this._contribTypeMapping = {
				author: "Author",
				"author non-byline": "Author",
				autahor: "Author",
				auther: "Author",
				editor: "Editor",
				"guest-editor": "Guest Editor",
				"group-author": "Group Author",
				collab: "Collaborator",
				"reviewed-by": "Reviewer",
				"nominated-by": "Nominator",
				corresp: "Corresponding Author",
				other: "Other",
				"assoc-editor": "Associate Editor",
				"associate editor": "Associate Editor",
				"series-editor": "Series Editor",
				contributor: "Contributor",
				chairman: "Chairman",
				"monographs-editor": "Monographs Editor",
				"contrib-author": "Contributing Author",
				organizer: "Organizer",
				chair: "Chair",
				discussant: "Discussant",
				presenter: "Presenter",
				"guest-issue-editor": "Guest Issue Editor",
				participant: "Participant",
				translator: "Translator"
			}, this.isAnnotation = function (t) {
				return void 0 !== this._annotationTypes[t]
			}, this.isParagraphish = function (t) {
				for (var e = 0; e < t.childNodes.length; e++) {
					var n = t.childNodes[e];
					if (n.nodeType !== Node.TEXT_NODE && !this.isAnnotation(n.tagName.toLowerCase())) return !1
				}
				return !0
			}, this.test = function (t, e) {
				return !0
			}, this.getName = function (t) {
				if (!t) return "N/A";
				var e = [],
					n = t.querySelector("surname"),
					r = t.querySelector("given-names"),
					o = t.querySelector("suffix");
				return r && e.push(r.textContent), n && e.push(n.textContent), o ? [e.join(" "), o.textContent].join(", ") : e.join(" ")
			}, this.toHtml = function (t) {
				if (!t) return "";
				var e = document.createElement("DIV");
				return e.appendChild(t.cloneNode(!0)), e.innerHTML
			}, this.mmlToHtmlString = function (t) {
				var e = this.toHtml(t);
				return e = e.replace(/<(\/)?mml:([^>]+)>/g, "<$1$2>")
			}, this.selectDirectChildren = function (t, e) {
				for (var n = [], r = t.querySelectorAll(e), o = 0; o < r.length; o++) {
					var i = r[o];
					i.parentElement === t && n.push(i)
				}
				return n
			}, this["import"] = function (t) {
				var e;
				if (r.isString(t)) {
					var n = new DOMParser;
					e = n.parseFromString(t, "text/xml")
				} else e = t;
				this.sanitizeXML(e);
				var o = this.createDocument();
				window.doc = o;
				var i = this.createState(e, o);
				return this.document(i, e)
			}, this.sanitizeXML = function (t) {}, this.createState = function (t, e) {
				return new c.State(this, t, e)
			}, this.createDocument = function () {
				var t = new a;
				return t
			}, this.show = function (t, e) {
				r.each(e, function (e) {
					this.showNode(t, e)
				}, this)
			}, this.extractDate = function (t) {
				if (!t) return null;
				var e = t.querySelector("year"),
					n = t.querySelector("month"),
					r = t.querySelector("day"),
					o = [e.textContent];
				return n && o.push(n.textContent), r && o.push(r.textContent), o.join("-")
			}, this.extractPublicationInfo = function (t, e) {
				for (var n = t.doc, 
						r = e.querySelector("article-meta"), 
						o = r.querySelector("pub-date"), 
						y = r.querySelector("article-meta pub-date[date-type=collection] year"),
						published_on_year = y ? y.textContent : "",
						m = r.querySelector("article-meta pub-date[date-type=pub] month"),
						published_on_month = m ? m.textContent : "",
						v = r.querySelector("article-meta volume"),
						volume = v ? v.textContent : "",
						is = r.querySelector("article-meta issue"),
						issue = is ? is.textContent : "",
						el = r.querySelector("article-meta elocation-id"),
						elocation = el ? el.textContent : "",
						i = r.querySelectorAll("history date"), 
						s = e.querySelector("journal-title"), 
						a = e.querySelector("article-id[pub-id-type=doi]"), 
						c = e.querySelector("related-article"), 
						u = this.extractArticleInfo(t, e), l = {
							id: "publication_info",
							type: "publication_info",
							published_on_month_year: published_on_year.concat('-', published_on_month),
							published_on: '; '+volume+'('+issue+'):'+elocation,
							journal: s ? s.textContent : "",
							related_article: c ? c.getAttribute("xlink:href") : "",
							doi: a ? a.textContent : "",
							article_info: u.id,
							article_type: "",
							keywords: [],
							links: [],
							subjects: [],
							supplements: [],
							history: [],
							research_organisms: [],
							provider: ""
						}, 
					p = 0; p < i.length; p++) {
					var h = i[p],
						d = {
							type: h.getAttribute("date-type"),
							date: this.extractDate(h)
						};
					l.history.push(d)
				}
				n.create(l), n.show("info", l.id, 0), this.enhancePublicationInfo(t, l)
			}, this.extractArticleInfo = function (t, e) {
				var n = {
						id: "articleinfo",
						type: "paragraph"
					},
					r = t.doc,
					o = [];
				return o = o.concat(this.extractEditor(t, e)), o = o.concat(this.extractDatasets(t, e)), o = o.concat(this.extractCustomMetaGroup(t, e)), o = o.concat(this.extractCorrespondence(t, e)), o = o.concat(this.extractContributions(t, e)), o = o.concat(this.extractInterestsConflict(t, e)), o = o.concat(this.extractAcknowledgements(t, e)), o = o.concat(this.extractNotes(t, e)), n.children = o, r.create(n), n
			}, this.extractEditor = function (t, e) {
				var n = [],
					r = t.doc,
					o = e.querySelector("contrib[contrib-type=editor]");
				if (o) {
					var i = [],
						s = this.getName(o.querySelector("name"));
					s && i.push(s);
					var a = o.querySelector("institution");
					a && i.push(a.textContent);
					var c = o.querySelector("country");
					c && i.push(c.textContent);
					var u = {
						type: "heading",
						id: t.nextId("heading"),
						level: 3,
						content: "Reviewing Editor"
					};
					r.create(u), n.push(u.id);
					var l = {
						type: "text",
						id: t.nextId("text"),
						content: i.join(", ")
					};
					r.create(l), n.push(l.id)
				}
				return n
			}, this.extractDatasets = function (t, e) {
				for (var n = [], r = t.doc, i = e.querySelectorAll("sec"), s = 0; s < i.length; s++) {
					var a = i[s],
						c = a.getAttribute("sec-type");
					if ("datasets" === c) {
						var u = {
							type: "heading",
							id: t.nextId("heading"),
							level: 3,
							content: "Major Datasets"
						};
						r.create(u), n.push(u.id);
						for (var l = this.datasets(t, o.dom.getChildren(a)), p = 0; p < l.length; p++) l[p] && n.push(l[p])
					}
				}
				return n
			};
			var t = function (e, n) {
				return n ? e.split(" ").map(function (e) {
					return t(e)
				}).join(" ") : e.charAt(0).toUpperCase() + e.slice(1)
			};
			this.capitalized = function (e, n) {
				return t(e, n)
			}, this.extractAcknowledgements = function (t, e) {
				var n = [],
					i = t.doc,
					s = e.querySelectorAll("ack");
				return s && s.length > 0 && r.each(s, function (e) {
					var s = e.querySelector("title"),
						a = {
							type: "heading",
							id: t.nextId("heading"),
							level: 3,
							content: s ? this.capitalized(s.textContent.toLowerCase(), "all") : "Acknowledgements"
						};
					i.create(a), n.push(a.id);
					var c = this.bodyNodes(t, o.dom.getChildren(e), {
						ignore: ["title"]
					});
					r.each(c, function (t) {
						n.push(t.id)
					})
				}, this), n
			}, this.extractInterestsConflict = function (t, e) {
				var n = [],
					i = t.doc,
					s =  e.querySelectorAll("fn[fn-type=conflict]");
				return s && s.length > 0 && r.each(s, function (e) {
					var s = e.querySelector("label"),
						a = {
							type: "heading",
							id: t.nextId("heading"),
							level: 3,
							content: s ? this.capitalized(s.textContent.toLowerCase(), "all") : "Interest conflicts"
						};
					i.create(a), n.push(a.id);
					var c = this.bodyNodes(t, o.dom.getChildren(e), {
                        ignore: ["label"]
					});
					r.each(c, function (t) {
						n.push(t.id)
					})
				}, this), n
			}, this.extractContributions = function (t, e) {
				var n = [],
					i = t.doc,
					s =  e.querySelectorAll("fn[fn-type=con]");
				return s && s.length > 0 && r.each(s, function (e) {
					var s = e.querySelector("label"),
						a = {
							type: "heading",
							id: t.nextId("heading"),
							level: 3,
							content: s ? this.capitalized(s.textContent.toLowerCase(), "all") : "Contributors"
						};
					i.create(a), n.push(a.id);
					var c = this.bodyNodes(t, o.dom.getChildren(e), {
                        ignore: ["label"]
					});
					r.each(c, function (t) {
						n.push(t.id)
					})
				}, this), n
			}, this.extractCorrespondence = function (t, e) {
				var n = [],
					r = t.doc,
					c = e.querySelector("corresp"),
					o = c ? c.textContent : "",
                    f = o.replace('Correspondence','');
				if (o) {
					var u = {
						type: "heading",
						id: t.nextId("heading"),
						level: 3,
						content: "Correspondence"
					};
					r.create(u), n.push(u.id);
					var l = {
						type: "text",
						id: t.nextId("text"),
						content: f.trim()
					};
					r.create(l), n.push(l.id)
				}
				return n
			},
                this.extractNotes = function () {
				var t = [];
				return t
			}, this.__ignoreCustomMetaNames = [], this.extractCustomMetaGroup = function (t, e) {
				var n = [],
					o = t.doc,
					i = e.querySelectorAll("article-meta-group custom-meta");
				if (0 === i.length) return n;
				for (var s = 0; s < i.length; s++) {
					var a = i[s],
						c = a.querySelector("meta-name"),
						u = a.querySelector("meta-value");
					if (!r.include(this.__ignoreCustomMetaNames, c.textContent)) {
						var l = {
							type: "heading",
							id: t.nextId("heading"),
							level: 3,
							content: ""
						};
						l.content = this.annotatedText(t, c, [l.id, "content"]), o.create(l);
						var p = this.paragraphGroup(t, u);
						n.push(l.id), n = n.concat(r.pluck(p, "id"))
					}
				}
				return n
			}, this.extractCopyrightAndLicense = function (t, e) {
				var n = [],
					i = t.doc,
					s = e.querySelector("permissions");
				if (s) {
					var a = {
						type: "heading",
						id: t.nextId("heading"),
						level: 3,
						content: "Copyright & License"
					};
					i.create(a), n.push(a.id);
					var c, u = s.querySelector("copyright-statement");
					if (u && (c = this.paragraphGroup(t, u), c && c.length && (n = n.concat(r.map(c, function (t) {
							return t.id
						})), "." !== u.textContent.trim().slice(-1)))) {
						var l = r.last(r.last(c).children);
						i.nodes[l].content += ". "
					}
					var p = s.querySelector("license");
					if (p)
						for (var h = p.firstElementChild; h; h = h.nextElementSibling) {
							var d = o.dom.getNodeType(h);
							("p" === d || "license-p" === d) && (c = this.paragraphGroup(t, h), c && c.length && (n = n.concat(r.pluck(c, "id"))))
						}
				}
				return n
			}, this.extractCover = function (t, e) {
				var n = t.doc,
					o = n.get("document"),
					i = {
						id: "cover",
						type: "cover",
						title: o.title,
						authors: [],
						"abstract": o["abstract"]
					};
				r.each(o.authors, function (e) {
					var r = n.get(e),
						o = {
							id: "text_" + e + "_reference",
							type: "text",
							content: r.name
						};
					n.create(o), i.authors.push(o.id);
					var s = {
						id: t.nextId("contributor_reference"),
						type: "contributor_reference",
						path: ["text_" + e + "_reference", "content"],
						range: [0, r.name.length],
						target: e
					};
					n.create(s)
				}, this), this.enhanceCover(t, i, e), n.create(i), n.show("content", i.id, 0)
			}, this.contribGroup = function (t, e) {
				var n, r = e.querySelectorAll("contrib");
				for (n = 0; n < r.length; n++) this.contributor(t, r[n]);
				var o = t.doc,
					i = e.querySelector("on-behalf-of");
				i && (o.on_behalf_of = i.textContent.trim())
			}, this.affiliation = function (t, e) {
				var n = t.doc,
					r = e.querySelector("institution"),
					o = e.querySelector("country"),
					i = e.querySelector("label"),
					s = e.querySelector("addr-line named-content[content-type=department]"),
					a = e.querySelector("addr-line named-content[content-type=city]"),
					c = {
						id: t.nextId("affiliation"),
						type: "affiliation",
						source_id: e.getAttribute("id"),
						label: i ? i.textContent : null,
						department: s ? s.textContent : null,
						city: a ? a.textContent : null,
						institution: r ? r.textContent : null,
						country: o ? o.textContent : null
					};
				n.create(c)
			}, this.contributor = function (t, e) {
				var n = t.doc,
					i = t.nextId("contributor"),
					s = {
						id: i,
						source_id: e.getAttribute("id"),
						type: "contributor",
						name: "",
						affiliations: [],
						fundings: [],
						bio: [],
						image: "",
						deceased: !1,
						emails: [],
						contribution: "",
						members: []
					},
					a = e.getAttribute("contrib-type");
				s.contributor_type = this._contribTypeMapping[a];
				var c = e.querySelector("role");
				c && (s.role = c.textContent);
				var u = e.querySelector("bio");
				u && r.each(o.dom.getChildren(u), function (e) {
					var n = e.querySelector("graphic");
					if (n) {
						var r = n.getAttribute("xlink:href");
						s.image = r
					} else {
						var o = this.paragraphGroup(t, e);
						o.length > 0 && (s.bio = [o[0].id])
					}
				}, this), "yes" === e.getAttribute("deceased") && (s.deceased = !0);
				var l = e.querySelector("contrib-id[contrib-id-type=orcid]");
				l && (s.orcid = l.textContent);
				var p = e.querySelector("name");
				if (p) s.name = this.getName(p);
				else {
					var h = e.querySelector("collab");
					h ? s.name = h.textContent : s.name = "N/A"
				}
				this.extractContributorProperties(t, e, s), 0 === s.affiliations.length && (s.affiliations = t.affiliations), s.competing_interests.length > 1 && (s.competing_interests = r.filter(s.competing_interests, function (t) {
					return t.indexOf("no competing") < 0
				})), "author" === e.getAttribute("contrib-type") && n.nodes.document.authors.push(i), n.create(s), n.show("info", s.id)
			}, this._getEqualContribs = function (t, e, n) {
				var o = [],
					i = t.xmlDoc.querySelectorAll("xref[rid=" + n + "]");
				return r.each(i, function (t) {
					var n = t.parentNode;
					n !== e && o.push(this.getName(n.querySelector("name")))
				}, this), o
			}, this.extractContributorProperties = function (t, e, n) {
				var o = t.doc,
					i = [],
					s = [],
					a = e.querySelectorAll("xref");
				r.each(a, function (r) {
					if ("aff" === r.getAttribute("ref-type")) {
						var a = r.getAttribute("rid"),
							c = o.getNodeBySourceId(a);
						c && (n.affiliations.push(c.id), t.used[a] = !0)
					} else if ("other" === r.getAttribute("ref-type")) {
						console.log("FIXME: please add documentation about using 'other' as indicator for extracting an awardGroup.");
						var u = t.xmlDoc.getElementById(r.getAttribute("rid"));
						if (!u) return;
						var l = u.querySelector("funding-source");
						if (!l) return;
						var p = u.querySelector("award-id");
						p = p ? ", " + p.textContent : "";
						var h = l.childNodes[0].textContent;
						n.fundings.push([h, p].join(""))
					} else if ("corresp" === r.getAttribute("ref-type")) {
						var d = r.getAttribute("rid"),
							f = t.xmlDoc.getElementById(d);
						if (!f) return;
						var g = f.querySelector("email");
						if (!g) return;
						n.emails.push(g.textContent)
					} else if ("fn" === r.getAttribute("ref-type")) {
						var y = r.getAttribute("rid"),
							m = t.xmlDoc.getElementById(y),
							v = !0;
						if (m) {
							var b = m.getAttribute("fn-type");
							switch (b) {
								case "con":
									n.contribution = m.textContent;
									break;
								case "conflict":
									s.push(m.textContent.trim());
									break;
								case "present-address":
									n.present_address = m.querySelector("p").textContent;
									break;
								case "equal":
									console.log("FIXME: isn't fnElem.getAttribute(id) === fnId?"), i = this._getEqualContribs(t, e, m.getAttribute("id"));
									break;
								case "other":
									console.log("FIXME: isn't fnElem.getAttribute(id) === fnId?"), m.getAttribute("id").indexOf("equal-contrib") >= 0 ? i = this._getEqualContribs(t, e, m.getAttribute("id")) : v = !1;
									break;
								default:
									v = !1
							}
							v && (t.used[y] = !0)
						}
					} else console.log("Skipping contrib's xref", r.textContent)
				}, this), s.length > 1 && (s = r.filter(s, function (t) {
					return t.indexOf("no competing") < 0
				})), n.competing_interests = s;
				var c = e.querySelector("xref[ref-type=other]");
				if (c) {
					var u = c.getAttribute("rid"),
						l = t.xmlDoc.querySelectorAll("#" + u + " contrib");
					n.members = r.map(l, function (t) {
						return this.getName(t.querySelector("name"))
					}, this)
				}
				n.equal_contrib = i, n.competing_interests = s
			}, this.document = function (t, e) {
				var n = t.doc,
					o = e.querySelector("article");
				if (!o) throw new s("Expected to find an 'article' element.");
				return this.article(t, o), this.postProcess(t), r.each(n.containers, function (t) {
					t.rebuild()
				}), n
			}, this.postProcess = function (t) {
				this.postProcessAnnotations(t)
			}, this.postProcessAnnotations = function (t) {
				for (var e = 0; e < t.annotations.length; e++) {
					var n = t.annotations[e];
					if (n.target) {
						var r = t.doc.getNodeBySourceId(n.target);
						r && (n.target = r.id)
					}
					t.doc.create(t.annotations[e])
				}
			}, this.article = function (t, e) {
				var n = t.doc,
					r = e.querySelector("article-id");
				r ? n.id = r.textContent : n.id = o.uuid(), this.extractDefinitions(t, e), this.extractAffilitations(t, e), this.extractContributors(t, e), this.extractCitations(t, e), this.extractCover(t, e), this.extractArticleMeta(t, e), this.extractPublicationInfo(t, e);
				var i = e.querySelector("body");
				i && this.body(t, i), this.extractFigures(t, e), this.enhanceArticle(t, e)
			}, this.extractDefinitions = function (t) {
				var link = t.xmlDoc.querySelectorAll("ext-link");
				r.each(link, function (link) {
					var content = link.textContent;
					var material = content.indexOf('http://cadernos.ensp.fiocruz.br/static/');
					if(content.indexOf('http://cadernos.ensp.fiocruz.br/static/') == 0){
						var s = t.nextId("ext-link"),
						i = {
							id: t.nextId("ext-link"),
							type: "definition",
							title: "<a href='"+content+"' target='_blank'>"+content+"</a>",
						};
						t.doc.create(i), t.doc.show("definitions", i.id)
					}
				})
			}, this.extractArticleMeta = function (t, e) {
				var n = e.querySelector("article-meta");
				if (!n) throw new s("Expected element: 'article-meta'");
				var r = n.querySelectorAll("article-id");
				this.articleIds(t, r);
				var o = n.querySelector("title-group");
				o && this.titleGroup(t, o);
				var i = n.querySelectorAll("pub-date");
				this.pubDates(t, i), this.abstracts(t, n)
			}, this.extractAffilitations = function (t, e) {
				for (var n = e.querySelectorAll("aff"), r = 0; r < n.length; r++) this.affiliation(t, n[r])
			}, this.extractContributors = function (t, e) {
				var n = e.querySelector("article-meta contrib-group");
				n && this.contribGroup(t, n)
			}, this.extractFigures = function (t, e) {
				for (var n = e.querySelector("body"), r = n.querySelectorAll("fig, table-wrap, supplementary-material, media[mimetype=video]"), i = [], s = 0; s < r.length; s++) {
					var a = r[s];
					if (!a._converted) {
						var c = o.dom.getNodeType(a),
							u = null;
						"fig" === c ? u = this.figure(t, a) : "table-wrap" === c ? u = this.tableWrap(t, a) : "media" === c ? u = this.video(t, a) : "supplementary-material" === c && (u = this.supplement(t, a)), u && i.push(u)
					}
				}
				this.show(t, i)
			}, this.extractCitations = function (t, e) {
				var n = e.querySelector("ref-list");
				n && this.refList(t, n)
			}, this.articleIds = function (t, e) {
				var n = t.doc;
				e.length > 0 ? n.id = e[0].textContent : n.id = o.uuid()
			}, this.titleGroup = function (t, e) {
				var n = t.doc,
					r = e.querySelector("article-title");
				r && (n.title = this.annotatedText(t, r, ["document", "title"], {
					ignore: ["xref"]
				}))
			}, this.pubDates = function (t, e) {
				var n = t.doc;
				if (e.length > 0) {
					var r = this.pubDate(t, e[0]);
					n.created_at = r.date
				}
			}, this.pubDate = function (t, e) {
				var n = -1,
					i = -1,
					s = -1;
				r.each(o.dom.getChildren(e), function (t) {
					var e = o.dom.getNodeType(t),
						r = t.textContent;
					"day" === e ? n = parseInt(r, 10) : "month" === e ? i = parseInt(r, 10) : "year" === e && (s = parseInt(r, 10))
				}, this);
				var a = new Date(s, i, n);
				return {
					date: a
				}
			}, this.abstracts = function (t, e) {
				var n = e.querySelectorAll("abstract");
				r.each(n, function (e) {
					this["abstract"](t, e)
				}, this)
			}, this["abstract"] = function (t, e) {
				var n = t.doc,
					r = [],
					i = e.querySelector("title"),
					userLang = navigator.language,
					s = {
						id: t.nextId("heading"),
						type: "heading",
						level: 1,
						content: userLang.substring(0, 2) == "pt" ? "Resumo" : userLang.substring(0, 2) == "es" ? "Resumen" : "Summary",
					};
				n.create(s), r.push(s), r = r.concat(this.bodyNodes(t, o.dom.getChildren(e), {
					ignore: ["title", "object-id"]
				})), r.length > 0 && this.show(t, r)
			}, this.body = function (t, e) {
				var i = this.bodyNodes(t, o.dom.getChildren(e));
				i.length > 0 && this.show(t, i)
			}, this._ignoredBodyNodes = {
				fig: !0,
				"table-wrap": !0
			}, this._bodyNodes = {}, this.bodyNodes = function (t, e, n) {
				for (var i, s = [], a = 0; a < e.length; a++) {
					var c = e[a],
						u = o.dom.getNodeType(c);
					if (this._bodyNodes[u]) {
						var l = this._bodyNodes[u].call(this, t, c);
						r.isArray(l) ? s = s.concat(l) : l && s.push(l)
					} else this._ignoredBodyNodes[u] || n && n.ignore && n.ignore.indexOf(u) >= 0 ? (i = this.ignoredNode(t, c, u), i && s.push(i)) : console.error("Node not yet supported as top-level node: " + u)
				}
				return s
			}, this._bodyNodes.p = function (t, e) {
				return this.paragraphGroup(t, e)
			}, this._bodyNodes.sec = function (t, e) {
				return this.section(t, e)
			}, this._bodyNodes.list = function (t, e) {
				return this.list(t, e)
			}, this._bodyNodes["disp-formula"] = function (t, e) {
				return this.formula(t, e)
			}, this._bodyNodes.caption = function (t, e) {
				return this.caption(t, e)
			}, this._bodyNodes["boxed-text"] = function (t, e) {
				return this.boxedText(t, e)
			}, this._bodyNodes["disp-quote"] = function (t, e) {
				return this.boxedText(t, e)
			}, this._bodyNodes.attrib = function (t, e) {
				return this.paragraphGroup(t, e)
			}, this._bodyNodes.comment = function (t, e) {
				return this.comment(t, e)
			}, this._bodyNodes.fig = function (t, e) {
				return this.figure(t, e)
			}, this.ignoredNode = function () {}, this.comment = function () {
				return null
			}, this.boxedText = function (t, e) {
				var n = t.doc,
					i = this.bodyNodes(t, o.dom.getChildren(e)),
					s = t.nextId("box"),
					a = {
						type: "box",
						id: s,
						source_id: e.getAttribute("id"),
						label: "",
						children: r.pluck(i, "id")
					};
				return n.create(a), a
			}, this.datasets = function (t, e) {
				for (var n = [], r = 0; r < e.length; r++) {
					var i = e[r],
						s = o.dom.getNodeType(i);
					if ("p" === s) {
						var a = i.querySelector("related-object");
						if (a) n = n.concat(this.indivdata(t, a));
						else {
							var c = this.paragraphGroup(t, i);
							c.length > 0 && n.push(c[0].id)
						}
					}
				}
				return n
			}, this.indivdata = function (t, e) {
				var n = t.doc,
					r = {
						type: "paragraph",
						id: t.nextId("paragraph"),
						children: []
					},
					i = {
						type: "text",
						id: t.nextId("text"),
						content: ""
					};
				r.children.push(i.id);
				for (var s = o.dom.getChildren(e), a = 0; a < s.length; a++) {
					var c, u = s[a],
						l = o.dom.getNodeType(u);
					if ("name" === l)
						for (var p = o.dom.getChildren(u), h = 0; h < p.length; h++) {
							var d = p[h];
							if (0 === h) c = this.paragraphGroup(t, d), r.children.push(c[0].children[0]);
							else {
								var f = {
									type: "text",
									id: t.nextId("text"),
									content: ", "
								};
								n.create(f), r.children.push(f.id), c = this.paragraphGroup(t, d), r.children.push(c[0].children[0])
							}
						} else c = this.paragraphGroup(t, u), c && c[0] && c[0].children && r.children.push(c[0].children[0])
				}
				return n.create(r), n.create(i), r.id
			}, this.section = function (t, e) {
				t.sectionLevel++;
				var n = t.doc,
					r = o.dom.getChildren(e),
					i = [],
					s = this.selectDirectChildren(e, "label")[0],
					a = this.selectDirectChildren(e, "title")[0];
				if (a || console.error("FIXME: every section should have a title", this.toHtml(e)), i = i.concat(this.bodyNodes(t, r, {
						ignore: ["title", "label"]
					})), i.length > 0 && a) {
					var c = t.nextId("heading"),
						u = {
							id: c,
							source_id: e.getAttribute("id"),
							type: "heading",
							level: t.sectionLevel,
							content: a ? this.annotatedText(t, a, [c, "content"]) : ""
						};
					s && (u.label = s.textContent), u.content.length > 0 && (n.create(u), i.unshift(u))
				} else 0 === i.length && console.info("NOTE: skipping section without content:", a ? a.innerHTML : "no title");
				return t.sectionLevel--, i
			}, this.ignoredParagraphElements = {
				comment: !0,
				"supplementary-material": !0,
				fig: !0,
				"fig-group": !0,
				"table-wrap": !0,
				media: !0
			}, this.acceptedParagraphElements = {
				"boxed-text": {
					handler: "boxedText"
				},
				list: {
					handler: "list"
				},
				"disp-formula": {
					handler: "formula"
				}
			}, this.inlineParagraphElements = {
				"inline-graphic": !0,
				"inline-formula": !0
			}, this.segmentParagraphElements = function (t) {
				for (var e = [], n = "", i = new o.dom.ChildNodeIterator(t); i.hasNext();) {
					var s = i.next(),
						a = o.dom.getNodeType(s);
					this.ignoredParagraphElements[a] || ("text" === a || this.isAnnotation(a) || this.inlineParagraphElements[a] ? ("paragraph" !== n && (e.push({
						handler: "paragraph",
						nodes: []
					}), n = "paragraph"), r.last(e).nodes.push(s)) : (this.acceptedParagraphElements[a] && e.push(r.extend({
						node: s
					}, this.acceptedParagraphElements[a])), n = a))
				}
				return e
			}, this.paragraphGroup = function (t, e) {
				for (var n = [], r = this.segmentParagraphElements(e), o = 0; o < r.length; o++) {
					var i, s = r[o];
					"paragraph" === s.handler ? (i = this.paragraph(t, s.nodes), i && (i.source_id = e.getAttribute("id"))) : i = this[s.handler](t, s.node), i && n.push(i)
				}
				return n
			}, this.paragraph = function (t, e) {
				var n = t.doc;
				t.skipWS = !0;
				for (var i = {
						id: t.nextId("paragraph"),
						type: "paragraph",
						children: null
					}, s = [], a = new o.dom.ChildNodeIterator(e); a.hasNext();) {
					var c = a.next(),
						u = o.dom.getNodeType(c);
					if ("text" === u || this.isAnnotation(u)) {
						var l = {
							id: t.nextId("text"),
							type: "text",
							content: null
						};
						t.stack.push({
							path: [l.id, "content"]
						});
						var p = this._annotatedText(t, a.back(), {
							offset: 0,
							breakOnUnknown: !0
						});
						p.length > 0 && (l.content = p, n.create(l), s.push(l)), t.stack.pop()
					} else if ("inline-graphic" === u) {
						var h = c.getAttribute("xlink:href"),
							d = {
								id: t.nextId("image"),
								type: "image",
								url: this.resolveURL(t, h)
							};
						n.create(d), s.push(d)
					} else if ("inline-formula" === u) {
						var f = this.formula(t, c, "inline");
						f && s.push(f)
					}
				}
				return 0 === s.length ? null : (i.children = r.map(s, function (t) {
					return t.id
				}), n.create(i), i)
			}, this.list = function (t, e) {
				var n = t.doc,
					r = {
						id: t.nextId("list"),
						source_id: e.getAttribute("id"),
						type: "list",
						items: [],
						ordered: !1
					};
				"ordered" === e.getAttribute("list-type") && (r.ordered = !0);
				for (var i = e.querySelectorAll("list-item"), s = 0; s < i.length; s++)
					for (var a = i[s], c = this.bodyNodes(t, o.dom.getChildren(a)), u = 0; u < c.length; u++) r.items.push(c[u].id);
				return n.create(r), r
			}, this.figure = function (t, e) {
				var n = t.doc,
					r = {
						type: "figure",
						id: t.nextId("figure"),
						source_id: e.getAttribute("id"),
						label: "Figure",
						url: "",
						caption: null
					},
					o = e.querySelector("label");
				o && (r.label = this.annotatedText(t, o, [r.id, "label"]));
				var i = e.querySelector("caption");
				if (i) {
					var s = this.caption(t, i);
					s && (r.caption = s.id)
				}
				var a = e.querySelector("attrib");
				a && (r.attrib = a.textContent);
				var c = e.getAttribute("position");
				return c && (r.position = c || ""), this.enhanceFigure(t, r, e), n.create(r), e._converted = !0, r
			}, this.supplement = function (t, e) {
				var n = t.doc,
					r = e.querySelector("label"),
					o = e.querySelector("media"),
					i = o ? o.getAttribute("xlink:href") : null,
					s = e.querySelector("object-id[pub-id-type='doi']");
				s = s ? "http://dx.doi.org/" + s.textContent : "";
				var a = {
						id: t.nextId("supplement"),
						source_id: e.getAttribute("id"),
						type: "supplement",
						label: r ? r.textContent : "",
						url: i,
						caption: null
					},
					c = e.querySelector("caption");
				if (c) {
					var u = this.caption(t, c);
					u && (a.caption = u.id)
				}
				return this.enhanceSupplement(t, a, e), n.create(a), a
			}, this.caption = function (t, e) {
				var n = t.doc,
					o = {
						id: t.nextId("caption"),
						source_id: e.getAttribute("id"),
						type: "caption",
						title: "",
						children: []
					},
					i = e.querySelector("title");
				if (i) {
					var s = this.paragraph(t, i);
					s && (o.title = s.id)
				}
				var a = [],
					c = e.querySelectorAll("p");
				return r.each(c, function (n) {
					if (n.parentNode === e) {
						var r = this.paragraph(t, n);
						r && a.push(r.id)
					}
				}, this), o.children = a, n.create(o), o
			}, this.video = function (t, e) {
				var n = t.doc,
					r = e.querySelector("label").textContent,
					o = t.nextId("video"),
					i = {
						id: o,
						source_id: e.getAttribute("id"),
						type: "video",
						label: r,
						title: "",
						caption: null,
						poster: ""
					},
					s = e.querySelector("caption");
				if (s) {
					var a = this.caption(t, s);
					a && (i.caption = a.id)
				}
				return this.enhanceVideo(t, i, e), n.create(i), i
			}, this.tableWrap = function (t, e) {
				var n = t.doc,
					r = e.querySelector("label"),
					o = {
						id: t.nextId("html_table"),
						source_id: e.getAttribute("id"),
						type: "html_table",
						title: "",
						label: r ? r.textContent : "Table",
						content: "",
						caption: null,
						footers: []
					},
					i = e.querySelector("table");
				return i && (o.content = this.toHtml(i)), this.extractTableCaption(t, o, e), this.enhanceTable(t, o, e), n.create(o), o
			}, this.extractTableCaption = function (t, e, n) {
				var r = n.querySelector("caption");
				if (r) {
					var o = this.caption(t, r);
					o && (e.caption = o.id)
				} else console.error("caption node not found for", n)
			}, this._getFormulaData = function (t) {
				for (var e = [], n = t.firstElementChild; n; n = n.nextElementSibling) {
					var r = o.dom.getNodeType(n);
					switch (r) {
						case "graphic":
						case "inline-graphic":
							e.push({
								format: "image",
								data: n.getAttribute("xlink:href")
							});
							break;
						case "svg":
							e.push({
								format: "svg",
								data: this.toHtml(n)
							});
							break;
						case "mml:math":
						case "math":
							e.push({
								format: "mathml",
								data: this.mmlToHtmlString(n)
							});
							break;
						case "tex-math":
							e.push({
								format: "latex",
								data: n.textContent
							});
							break;
						case "label":
							break;
						default:
							console.error("Unsupported formula element of type " + r)
					}
				}
				return e
			}, this.formula = function (t, e, n) {
				var r = t.doc,
					o = {
						id: t.nextId("formula"),
						source_id: e.getAttribute("id"),
						type: "formula",
						label: "",
						inline: !!n,
						data: [],
						format: []
					},
					i = e.querySelector("label");
				i && (o.label = i.textContent);
				for (var s = this._getFormulaData(e, n), a = 0; a < s.length; a++) o.format.push(s[a].format), o.data.push(s[a].data);
				return r.create(o), o
			}, this.citationTypes = {
				"mixed-citation": !0,
				"element-citation": !0
			}, this.refList = function (t, e) {
				for (var n = e.querySelectorAll("ref"), r = 0; r < n.length; r++) this.ref(t, n[r])
			}, this.ref = function (t, e) {
				for (var n = o.dom.getChildren(e), r = 0; r < n.length; r++) {
					var i = n[r],
						s = o.dom.getNodeType(i);
					this.citationTypes[s] ? this.citation(t, e, i) : "label" === s || console.error("Not supported in 'ref': ", s)
				}
			}, this.citation = function (t, e, n) {
				var r, o, i = t.doc,
					s = t.nextId("article_citation"),
					a = n.querySelector("person-group");
				if (!a) return void console.error("FIXME: there is one of those 'mixed-citation' without any structure. Skipping ...", n);
				r = {
					id: s,
					source_id: e.getAttribute("id"),
					type: "citation",
					title: "N/A",
					label: "",
					authors: [],
					doi: "",
					source: "",
					volume: "",
					fpage: "",
					lpage: "",
					citation_urls: []
				};
				var c = a.querySelectorAll("name");
				for (o = 0; o < c.length; o++) r.authors.push(this.getName(c[o]));
				var u = a.querySelectorAll("collab");
				for (o = 0; o < u.length; o++) r.authors.push(u[o].textContent);
				var l = n.querySelector("source");
				l && (r.source = l.textContent);
				var p = n.querySelector("article-title");
				if (p) r.title = this.annotatedText(t, p, [s, "title"]);
				else {
					var h = n.querySelector("comment");
					h ? r.title = this.annotatedText(t, h, [s, "title"]) : l ? r.title = this.annotatedText(t, l, [s, "title"]) : console.error("FIXME: this citation has no title", n)
				}
				var d = n.querySelector("volume");
				d && (r.volume = d.textContent);
				var f = n.querySelector("publisher-loc");
				f && (r.publisher_location = f.textContent);
				var g = n.querySelector("publisher-name");
				g && (r.publisher_name = g.textContent);
				var y = n.querySelector("fpage");
				y && (r.fpage = y.textContent);
				var m = n.querySelector("lpage");
				m && (r.lpage = m.textContent);
				var v = n.querySelector("year");
				v && (r.year = v.textContent);
				var b = e.querySelector("label");
				b && (r.label = b.textContent);
				var w = n.querySelector("pub-id[pub-id-type='doi'], ext-link[ext-link-type='doi']");
				return w && (r.doi = "http://dx.doi.org/" + w.textContent), i.create(r), i.show("citations", s), r
			}, this.back = function () {
				return null
			}, this.createAnnotation = function (t, e, n, o) {
				if (n !== o) {
					var i = e.tagName.toLowerCase(),
						s = {
							type: "annotation",
							path: r.last(t.stack).path,
							range: [n, o]
						};
					this.addAnnotationData(t, s, e, i), this.enhanceAnnotationData(t, s, e, i), s.id = t.nextId(s.type), t.annotations.push(s)
				}
			}, this.addAnnotationData = function (t, e, n, r) {
				if (e.type = this._annotationTypes[r] || "annotation", "xref" === r) this.addAnnotationDataForXref(t, e, n);
				else if ("ext-link" === r || "uri" === r) {
					e.url = n.getAttribute("xlink:href");
					var o = n.getAttribute("ext-link-type") || "";
					"uri" !== r && "uri" !== o.toLowerCase() || /^\w+:\/\//.exec(e.url) || /^\//.exec(e.url) ? "doi" === o.toLowerCase() && (e.url = ["http://dx.doi.org/", e.url].join("")) : e.url = "http://" + e.url
				} else if ("email" === r) e.url = "mailto:" + n.textContent.trim();
				else if ("inline-graphic" === r) e.url = n.getAttribute("xlink:href");
				else if ("inline-formula" === r) {
					var i = this.formula(t, n, "inline");
					e.target = i.id
				}
			}, this.addAnnotationDataForXref = function (t, e, n) {
				var r = n.getAttribute("ref-type"),
					o = n.getAttribute("rid");
				e.type = this._refTypeMapping[r] || "cross_reference", o && (e.target = o)
			}, this.annotatedText = function (t, e, n, r) {
				r = r || {}, t.stack.push({
					path: n,
					ignore: r.ignore
				});
				var i = new o.dom.ChildNodeIterator(e),
					s = this._annotatedText(t, i, r);
				return t.stack.pop(), s
			}, this._annotatedText = function (t, e, n) {
				for (var r = "", i = void 0 === n.offset ? 0 : n.offset, s = !!n.nested, a = !!n.breakOnUnknown; e.hasNext();) {
					var c = e.next();
					if (c.nodeType === Node.TEXT_NODE) {
						var u = t.acceptText(c.textContent);
						r += u, i += u.length
					} else {
						var l, p = o.dom.getNodeType(c);
						if (this.isAnnotation(p)) {
							if (t.top().ignore.indexOf(p) < 0) {
								var h = i;
								l = this._annotationTextHandler[p] ? this._annotationTextHandler[p].call(this, t, c, p, i) : this._getAnnotationText(t, c, p, i), r += l, i += l.length, t.ignoreAnnotations || this.createAnnotation(t, c, h, i)
							}
						} else if (a) {
							if (!s) {
								e.back();
								break
							}
							console.error("Node not yet supported in annoted text: " + p)
						} else t.top().ignore.indexOf(p) < 0 && (l = this._getAnnotationText(t, c, p, i), r += l, i += l.length)
					}
				}
				return r
			}, this._annotationTextHandler = {}, this._getAnnotationText = function (t, e, n, r) {
				var i = new o.dom.ChildNodeIterator(e),
					s = this._annotatedText(t, i, {
						offset: r,
						nested: !0
					});
				return s
			}, this._annotationTextHandler["ext-link"] = function (t, e, n, r) {
				var o = this._getAnnotationText(t, e, r);
				return "ext-link" === n && e.getAttribute("xlink:href") === o.trim() && (o = this.shortenLinkLabel(t, o)), o
			}, this._annotationTextHandler["inline-formula"] = function (t) {
				return t.acceptText("{{inline-formula}}")
			}, this.shortenLinkLabel = function (t, e) {
				var n = 50,
					r = 10;
				if (e.length > n) {
					var o = /((?:\w+:\/\/)?[\/]?[^\/]+[\/]?)(.*)/.exec(e);
					if (o) {
						var i = o[1] || "",
							s = o[2] || "";
						if (i.length > n - r) e = i.substring(0, n - r) + "..." + s.substring(s.length - r - 3);
						else {
							var a = Math.max(n - i.length - 3, r - 3);
							e = i + "..." + s.substring(s.length - a)
						}
					} else e = e.substring(0, n - r) + "..." + e.substring(e.length - r - 3)
				}
				return e
			}, this.getBaseURL = function (t) {
				var e = t.xmlDoc.querySelector("article").getAttribute("xml:base");
				return e || t.options.baseURL
			}, this.enhanceArticle = function (t, e) {}, this.enhanceCover = function (t, e, n) {}, this.enhanceFigure = function (t, e, n) {
				var r = n.querySelector("graphic"),
					o = r.getAttribute("xlink:href");
				e.url = this.resolveURL(t, o)
			}, this.enhancePublicationInfo = function (t, e, n) {}, this.enhanceSupplement = function (t, e, n) {}, this.enhanceTable = function (t, e, n) {}, this.enhanceVideo = function (t, e, n) {
				var r, o = n.getAttribute("xlink:href");
				if (o.match(/http:/)) {
					var i = o.lastIndexOf(".");
					return r = o.substring(0, i), e.url = r + ".mp4", e.url_ogv = r + ".ogv", e.url_webm = r + ".webm", void(e.poster = r + ".png")
				}
				var s = this.getBaseURL(t);
				r = o.split(".")[0], e.url = s + r + ".mp4", e.url_ogv = s + r + ".ogv", e.url_webm = s + r + ".webm", e.poster = s + r + ".png"
			}, this.resolveURL = function (t, e) {
				return e.match(/http:/) ? e : [t.options.baseURL, e].join("")
			}, this.viewMapping = {
				box: "content",
				supplement: "figures",
				figure: "figures",
				html_table: "figures",
				video: "figures"
			}, this.enhanceAnnotationData = function (t, e, n, r) {}, this.showNode = function (t, e) {
				var n = this.viewMapping[e.type] || "content";
				t.doc.show(n, e.id)
			}
		}, c.State = function (t, e, n) {
			var o = this;
			this.xmlDoc = e, this.doc = n, this.options = t.options, this.annotations = [], this.stack = [], this.sectionLevel = 1, this.affiliations = [];
			var i = {};
			this.nextId = function (t) {
				return i[t] = i[t] || 0, i[t]++, t + "_" + i[t]
			}, this.used = {};
			var s = /^\s+/g,
				a = /^\s*/g,
				c = /\s+$/g,
				u = /\s+/g,
				l = " ",
				p = /[\t\n\r]+/g;
			this.lastChar = "", this.skipWS = !1, this.acceptText = function (t) {
				return this.options.TRIM_WHITESPACES ? (t = t.replace(p, ""), t = this.lastChar === l || this.skipWS ? t.replace(a, "") : t.replace(s, l), this.skipWS = !1, t = t.replace(c, l), this.options.REMOVE_INNER_WS && (t = t.replace(u, l)), this.lastChar = t[t.length - 1] || this.lastChar, t) : t
			}, this.top = function () {
				var t = r.last(o.stack);
				return t = t || {}, t.ignore = t.ignore || [], t
			}
		}, c.prototype = new c.Prototype, c.prototype.constructor = c, c.DefaultOptions = {
			TRIM_WHITESPACES: !0,
			REMOVE_INNER_WS: !0
		}, e.exports = c
	}, {
		"../article": 6,
		"../substance/util": 175,
		underscore: 124
	}],
	124: [function (t, e, n) {
		(function () {
			function t(t) {
				function e(e, n, r, o, i, s) {
					for (; i >= 0 && s > i; i += t) {
						var a = o ? o[i] : i;
						r = n(r, e[a], a, e)
					}
					return r
				}
				return function (n, r, o, i) {
					r = _(r, i, 4);
					var s = !S(n) && w.keys(n),
						a = (s || n).length,
						c = t > 0 ? 0 : a - 1;
					return arguments.length < 3 && (o = n[s ? s[c] : c], c += t), e(n, r, o, s, c, a)
				}
			}

			function r(t) {
				return function (e, n, r) {
					n = x(n, r);
					for (var o = k(e), i = t > 0 ? 0 : o - 1; i >= 0 && o > i; i += t)
						if (n(e[i], i, e)) return i;
					return -1
				}
			}

			function o(t, e, n) {
				return function (r, o, i) {
					var s = 0,
						a = k(r);
					if ("number" == typeof i) t > 0 ? s = i >= 0 ? i : Math.max(i + a, s) : a = i >= 0 ? Math.min(i + 1, a) : i + a + 1;
					else if (n && i && a) return i = n(r, o), r[i] === o ? i : -1;
					if (o !== o) return i = e(h.call(r, s, a), w.isNaN), i >= 0 ? i + s : -1;
					for (i = t > 0 ? s : a - 1; i >= 0 && a > i; i += t)
						if (r[i] === o) return i;
					return -1
				}
			}

			function i(t, e) {
				var n = $.length,
					r = t.constructor,
					o = w.isFunction(r) && r.prototype || u,
					i = "constructor";
				for (w.has(t, i) && !w.contains(e, i) && e.push(i); n--;) i = $[n], i in t && t[i] !== o[i] && !w.contains(e, i) && e.push(i)
			}
			var s = this,
				a = s._,
				c = Array.prototype,
				u = Object.prototype,
				l = Function.prototype,
				p = c.push,
				h = c.slice,
				d = u.toString,
				f = u.hasOwnProperty,
				g = Array.isArray,
				y = Object.keys,
				m = l.bind,
				v = Object.create,
				b = function () {},
				w = function (t) {
					return t instanceof w ? t : this instanceof w ? void(this._wrapped = t) : new w(t)
				};
			"undefined" != typeof n ? ("undefined" != typeof e && e.exports && (n = e.exports = w), n._ = w) : s._ = w, w.VERSION = "1.8.3";
			var _ = function (t, e, n) {
					if (void 0 === e) return t;
					switch (null == n ? 3 : n) {
						case 1:
							return function (n) {
								return t.call(e, n)
							};
						case 2:
							return function (n, r) {
								return t.call(e, n, r)
							};
						case 3:
							return function (n, r, o) {
								return t.call(e, n, r, o)
							};
						case 4:
							return function (n, r, o, i) {
								return t.call(e, n, r, o, i)
							}
					}
					return function () {
						return t.apply(e, arguments)
					}
				},
				x = function (t, e, n) {
					return null == t ? w.identity : w.isFunction(t) ? _(t, e, n) : w.isObject(t) ? w.matcher(t) : w.property(t)
				};
			w.iteratee = function (t, e) {
				return x(t, e, 1 / 0)
			};
			var C = function (t, e) {
					return function (n) {
						var r = arguments.length;
						if (2 > r || null == n) return n;
						for (var o = 1; r > o; o++)
							for (var i = arguments[o], s = t(i), a = s.length, c = 0; a > c; c++) {
								var u = s[c];
								e && void 0 !== n[u] || (n[u] = i[u])
							}
						return n
					}
				},
				P = function (t) {
					if (!w.isObject(t)) return {};
					if (v) return v(t);
					b.prototype = t;
					var e = new b;
					return b.prototype = null, e
				},
				T = function (t) {
					return function (e) {
						return null == e ? void 0 : e[t]
					}
				},
				N = Math.pow(2, 53) - 1,
				k = T("length"),
				S = function (t) {
					var e = k(t);
					return "number" == typeof e && e >= 0 && N >= e
				};
			w.each = w.forEach = function (t, e, n) {
				e = _(e, n);
				var r, o;
				if (S(t))
					for (r = 0, o = t.length; o > r; r++) e(t[r], r, t);
				else {
					var i = w.keys(t);
					for (r = 0, o = i.length; o > r; r++) e(t[i[r]], i[r], t)
				}
				return t
			}, w.map = w.collect = function (t, e, n) {
				e = x(e, n);
				for (var r = !S(t) && w.keys(t), o = (r || t).length, i = Array(o), s = 0; o > s; s++) {
					var a = r ? r[s] : s;
					i[s] = e(t[a], a, t)
				}
				return i
			}, w.reduce = w.foldl = w.inject = t(1), w.reduceRight = w.foldr = t(-1), w.find = w.detect = function (t, e, n) {
				var r;
				return r = S(t) ? w.findIndex(t, e, n) : w.findKey(t, e, n), void 0 !== r && -1 !== r ? t[r] : void 0
			}, w.filter = w.select = function (t, e, n) {
				var r = [];
				return e = x(e, n), w.each(t, function (t, n, o) {
					e(t, n, o) && r.push(t)
				}), r
			}, w.reject = function (t, e, n) {
				return w.filter(t, w.negate(x(e)), n)
			}, w.every = w.all = function (t, e, n) {
				e = x(e, n);
				for (var r = !S(t) && w.keys(t), o = (r || t).length, i = 0; o > i; i++) {
					var s = r ? r[i] : i;
					if (!e(t[s], s, t)) return !1
				}
				return !0
			}, w.some = w.any = function (t, e, n) {
				e = x(e, n);
				for (var r = !S(t) && w.keys(t), o = (r || t).length, i = 0; o > i; i++) {
					var s = r ? r[i] : i;
					if (e(t[s], s, t)) return !0
				}
				return !1
			}, w.contains = w.includes = w.include = function (t, e, n, r) {
				return S(t) || (t = w.values(t)), ("number" != typeof n || r) && (n = 0), w.indexOf(t, e, n) >= 0
			}, w.invoke = function (t, e) {
				var n = h.call(arguments, 2),
					r = w.isFunction(e);
				return w.map(t, function (t) {
					var o = r ? e : t[e];
					return null == o ? o : o.apply(t, n)
				})
			}, w.pluck = function (t, e) {
				return w.map(t, w.property(e))
			}, w.where = function (t, e) {
				return w.filter(t, w.matcher(e))
			}, w.findWhere = function (t, e) {
				return w.find(t, w.matcher(e))
			}, w.max = function (t, e, n) {
				var r, o, i = -(1 / 0),
					s = -(1 / 0);
				if (null == e && null != t) {
					t = S(t) ? t : w.values(t);
					for (var a = 0, c = t.length; c > a; a++) r = t[a], r > i && (i = r)
				} else e = x(e, n), w.each(t, function (t, n, r) {
					o = e(t, n, r), (o > s || o === -(1 / 0) && i === -(1 / 0)) && (i = t, s = o)
				});
				return i
			}, w.min = function (t, e, n) {
				var r, o, i = 1 / 0,
					s = 1 / 0;
				if (null == e && null != t) {
					t = S(t) ? t : w.values(t);
					for (var a = 0, c = t.length; c > a; a++) r = t[a], i > r && (i = r)
				} else e = x(e, n), w.each(t, function (t, n, r) {
					o = e(t, n, r), (s > o || o === 1 / 0 && i === 1 / 0) && (i = t, s = o)
				});
				return i
			}, w.shuffle = function (t) {
				for (var e, n = S(t) ? t : w.values(t), r = n.length, o = Array(r), i = 0; r > i; i++) e = w.random(0, i), e !== i && (o[i] = o[e]), o[e] = n[i];
				return o
			}, w.sample = function (t, e, n) {
				return null == e || n ? (S(t) || (t = w.values(t)), t[w.random(t.length - 1)]) : w.shuffle(t).slice(0, Math.max(0, e))
			}, w.sortBy = function (t, e, n) {
				return e = x(e, n), w.pluck(w.map(t, function (t, n, r) {
					return {
						value: t,
						index: n,
						criteria: e(t, n, r)
					}
				}).sort(function (t, e) {
					var n = t.criteria,
						r = e.criteria;
					if (n !== r) {
						if (n > r || void 0 === n) return 1;
						if (r > n || void 0 === r) return -1
					}
					return t.index - e.index
				}), "value")
			};
			var A = function (t) {
				return function (e, n, r) {
					var o = {};
					return n = x(n, r), w.each(e, function (r, i) {
						var s = n(r, i, e);
						t(o, r, s)
					}), o
				}
			};
			w.groupBy = A(function (t, e, n) {
				w.has(t, n) ? t[n].push(e) : t[n] = [e]
			}), w.indexBy = A(function (t, e, n) {
				t[n] = e
			}), w.countBy = A(function (t, e, n) {
				w.has(t, n) ? t[n]++ : t[n] = 1
			}), w.toArray = function (t) {
				return t ? w.isArray(t) ? h.call(t) : S(t) ? w.map(t, w.identity) : w.values(t) : []
			}, w.size = function (t) {
				return null == t ? 0 : S(t) ? t.length : w.keys(t).length
			}, w.partition = function (t, e, n) {
				e = x(e, n);
				var r = [],
					o = [];
				return w.each(t, function (t, n, i) {
					(e(t, n, i) ? r : o).push(t)
				}), [r, o]
			}, w.first = w.head = w.take = function (t, e, n) {
				return null == t ? void 0 : null == e || n ? t[0] : w.initial(t, t.length - e)
			}, w.initial = function (t, e, n) {
				return h.call(t, 0, Math.max(0, t.length - (null == e || n ? 1 : e)))
			}, w.last = function (t, e, n) {
				return null == t ? void 0 : null == e || n ? t[t.length - 1] : w.rest(t, Math.max(0, t.length - e))
			}, w.rest = w.tail = w.drop = function (t, e, n) {
				return h.call(t, null == e || n ? 1 : e)
			}, w.compact = function (t) {
				return w.filter(t, w.identity)
			};
			var V = function (t, e, n, r) {
				for (var o = [], i = 0, s = r || 0, a = k(t); a > s; s++) {
					var c = t[s];
					if (S(c) && (w.isArray(c) || w.isArguments(c))) {
						e || (c = V(c, e, n));
						var u = 0,
							l = c.length;
						for (o.length += l; l > u;) o[i++] = c[u++]
					} else n || (o[i++] = c)
				}
				return o
			};
			w.flatten = function (t, e) {
				return V(t, e, !1)
			}, w.without = function (t) {
				return w.difference(t, h.call(arguments, 1))
			}, w.uniq = w.unique = function (t, e, n, r) {
				w.isBoolean(e) || (r = n, n = e, e = !1), null != n && (n = x(n, r));
				for (var o = [], i = [], s = 0, a = k(t); a > s; s++) {
					var c = t[s],
						u = n ? n(c, s, t) : c;
					e ? (s && i === u || o.push(c), i = u) : n ? w.contains(i, u) || (i.push(u), o.push(c)) : w.contains(o, c) || o.push(c)
				}
				return o
			}, w.union = function () {
				return w.uniq(V(arguments, !0, !0))
			}, w.intersection = function (t) {
				for (var e = [], n = arguments.length, r = 0, o = k(t); o > r; r++) {
					var i = t[r];
					if (!w.contains(e, i)) {
						for (var s = 1; n > s && w.contains(arguments[s], i); s++);
						s === n && e.push(i)
					}
				}
				return e
			}, w.difference = function (t) {
				var e = V(arguments, !0, !0, 1);
				return w.filter(t, function (t) {
					return !w.contains(e, t)
				})
			}, w.zip = function () {
				return w.unzip(arguments)
			}, w.unzip = function (t) {
				for (var e = t && w.max(t, k).length || 0, n = Array(e), r = 0; e > r; r++) n[r] = w.pluck(t, r);
				return n
			}, w.object = function (t, e) {
				for (var n = {}, r = 0, o = k(t); o > r; r++) e ? n[t[r]] = e[r] : n[t[r][0]] = t[r][1];
				return n
			}, w.findIndex = r(1), w.findLastIndex = r(-1), w.sortedIndex = function (t, e, n, r) {
				n = x(n, r, 1);
				for (var o = n(e), i = 0, s = k(t); s > i;) {
					var a = Math.floor((i + s) / 2);
					n(t[a]) < o ? i = a + 1 : s = a
				}
				return i
			}, w.indexOf = o(1, w.findIndex, w.sortedIndex), w.lastIndexOf = o(-1, w.findLastIndex), w.range = function (t, e, n) {
				null == e && (e = t || 0, t = 0), n = n || 1;
				for (var r = Math.max(Math.ceil((e - t) / n), 0), o = Array(r), i = 0; r > i; i++, t += n) o[i] = t;
				return o
			};
			var E = function (t, e, n, r, o) {
				if (!(r instanceof e)) return t.apply(n, o);
				var i = P(t.prototype),
					s = t.apply(i, o);
				return w.isObject(s) ? s : i
			};
			w.bind = function (t, e) {
				if (m && t.bind === m) return m.apply(t, h.call(arguments, 1));
				if (!w.isFunction(t)) throw new TypeError("Bind must be called on a function");
				var n = h.call(arguments, 2),
					r = function () {
						return E(t, r, e, this, n.concat(h.call(arguments)))
					};
				return r
			}, w.partial = function (t) {
				var e = h.call(arguments, 1),
					n = function () {
						for (var r = 0, o = e.length, i = Array(o), s = 0; o > s; s++) i[s] = e[s] === w ? arguments[r++] : e[s];
						for (; r < arguments.length;) i.push(arguments[r++]);
						return E(t, n, this, this, i)
					};
				return n
			}, w.bindAll = function (t) {
				var e, n, r = arguments.length;
				if (1 >= r) throw new Error("bindAll must be passed function names");
				for (e = 1; r > e; e++) n = arguments[e], t[n] = w.bind(t[n], t);
				return t
			}, w.memoize = function (t, e) {
				var n = function (r) {
					var o = n.cache,
						i = "" + (e ? e.apply(this, arguments) : r);
					return w.has(o, i) || (o[i] = t.apply(this, arguments)), o[i]
				};
				return n.cache = {}, n
			}, w.delay = function (t, e) {
				var n = h.call(arguments, 2);
				return setTimeout(function () {
					return t.apply(null, n)
				}, e)
			}, w.defer = w.partial(w.delay, w, 1), w.throttle = function (t, e, n) {
				var r, o, i, s = null,
					a = 0;
				n || (n = {});
				var c = function () {
					a = n.leading === !1 ? 0 : w.now(), s = null, i = t.apply(r, o), s || (r = o = null)
				};
				return function () {
					var u = w.now();
					a || n.leading !== !1 || (a = u);
					var l = e - (u - a);
					return r = this, o = arguments, 0 >= l || l > e ? (s && (clearTimeout(s), s = null), a = u, i = t.apply(r, o), s || (r = o = null)) : s || n.trailing === !1 || (s = setTimeout(c, l)), i
				}
			}, w.debounce = function (t, e, n) {
				var r, o, i, s, a, c = function () {
					var u = w.now() - s;
					e > u && u >= 0 ? r = setTimeout(c, e - u) : (r = null, n || (a = t.apply(i, o), r || (i = o = null)))
				};
				return function () {
					i = this, o = arguments, s = w.now();
					var u = n && !r;
					return r || (r = setTimeout(c, e)), u && (a = t.apply(i, o), i = o = null), a
				}
			}, w.wrap = function (t, e) {
				return w.partial(e, t)
			}, w.negate = function (t) {
				return function () {
					return !t.apply(this, arguments)
				}
			}, w.compose = function () {
				var t = arguments,
					e = t.length - 1;
				return function () {
					for (var n = e, r = t[e].apply(this, arguments); n--;) r = t[n].call(this, r);
					return r
				}
			}, w.after = function (t, e) {
				return function () {
					return --t < 1 ? e.apply(this, arguments) : void 0
				}
			}, w.before = function (t, e) {
				var n;
				return function () {
					return --t > 0 && (n = e.apply(this, arguments)), 1 >= t && (e = null), n
				}
			}, w.once = w.partial(w.before, 2);
			var j = !{
					toString: null
				}.propertyIsEnumerable("toString"),
				$ = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
			w.keys = function (t) {
				if (!w.isObject(t)) return [];
				if (y) return y(t);
				var e = [];
				for (var n in t) w.has(t, n) && e.push(n);
				return j && i(t, e), e
			}, w.allKeys = function (t) {
				if (!w.isObject(t)) return [];
				var e = [];
				for (var n in t) e.push(n);
				return j && i(t, e), e
			}, w.values = function (t) {
				for (var e = w.keys(t), n = e.length, r = Array(n), o = 0; n > o; o++) r[o] = t[e[o]];
				return r
			}, w.mapObject = function (t, e, n) {
				e = x(e, n);
				for (var r, o = w.keys(t), i = o.length, s = {}, a = 0; i > a; a++) r = o[a], s[r] = e(t[r], r, t);
				return s
			}, w.pairs = function (t) {
				for (var e = w.keys(t), n = e.length, r = Array(n), o = 0; n > o; o++) r[o] = [e[o], t[e[o]]];
				return r
			}, w.invert = function (t) {
				for (var e = {}, n = w.keys(t), r = 0, o = n.length; o > r; r++) e[t[n[r]]] = n[r];
				return e
			}, w.functions = w.methods = function (t) {
				var e = [];
				for (var n in t) w.isFunction(t[n]) && e.push(n);
				return e.sort()
			}, w.extend = C(w.allKeys), w.extendOwn = w.assign = C(w.keys), w.findKey = function (t, e, n) {
				e = x(e, n);
				for (var r, o = w.keys(t), i = 0, s = o.length; s > i; i++)
					if (r = o[i], e(t[r], r, t)) return r
			}, w.pick = function (t, e, n) {
				var r, o, i = {},
					s = t;
				if (null == s) return i;
				w.isFunction(e) ? (o = w.allKeys(s), r = _(e, n)) : (o = V(arguments, !1, !1, 1), r = function (t, e, n) {
					return e in n
				}, s = Object(s));
				for (var a = 0, c = o.length; c > a; a++) {
					var u = o[a],
						l = s[u];
					r(l, u, s) && (i[u] = l)
				}
				return i
			}, w.omit = function (t, e, n) {
				if (w.isFunction(e)) e = w.negate(e);
				else {
					var r = w.map(V(arguments, !1, !1, 1), String);
					e = function (t, e) {
						return !w.contains(r, e)
					}
				}
				return w.pick(t, e, n)
			}, w.defaults = C(w.allKeys, !0), w.create = function (t, e) {
				var n = P(t);
				return e && w.extendOwn(n, e), n
			}, w.clone = function (t) {
				return w.isObject(t) ? w.isArray(t) ? t.slice() : w.extend({}, t) : t
			}, w.tap = function (t, e) {
				return e(t), t
			}, w.isMatch = function (t, e) {
				var n = w.keys(e),
					r = n.length;
				if (null == t) return !r;
				for (var o = Object(t), i = 0; r > i; i++) {
					var s = n[i];
					if (e[s] !== o[s] || !(s in o)) return !1
				}
				return !0
			};
			var I = function (t, e, n, r) {
				if (t === e) return 0 !== t || 1 / t === 1 / e;
				if (null == t || null == e) return t === e;
				t instanceof w && (t = t._wrapped), e instanceof w && (e = e._wrapped);
				var o = d.call(t);
				if (o !== d.call(e)) return !1;
				switch (o) {
					case "[object RegExp]":
					case "[object String]":
						return "" + t == "" + e;
					case "[object Number]":
						return +t !== +t ? +e !== +e : 0 === +t ? 1 / +t === 1 / e : +t === +e;
					case "[object Date]":
					case "[object Boolean]":
						return +t === +e
				}
				var i = "[object Array]" === o;
				if (!i) {
					if ("object" != typeof t || "object" != typeof e) return !1;
					var s = t.constructor,
						a = e.constructor;
					if (s !== a && !(w.isFunction(s) && s instanceof s && w.isFunction(a) && a instanceof a) && "constructor" in t && "constructor" in e) return !1
				}
				n = n || [], r = r || [];
				for (var c = n.length; c--;)
					if (n[c] === t) return r[c] === e;
				if (n.push(t), r.push(e), i) {
					if (c = t.length, c !== e.length) return !1;
					for (; c--;)
						if (!I(t[c], e[c], n, r)) return !1
				} else {
					var u, l = w.keys(t);
					if (c = l.length, w.keys(e).length !== c) return !1;
					for (; c--;)
						if (u = l[c], !w.has(e, u) || !I(t[u], e[u], n, r)) return !1
				}
				return n.pop(), r.pop(), !0
			};
			w.isEqual = function (t, e) {
				return I(t, e)
			}, w.isEmpty = function (t) {
				return null == t ? !0 : S(t) && (w.isArray(t) || w.isString(t) || w.isArguments(t)) ? 0 === t.length : 0 === w.keys(t).length
			}, w.isElement = function (t) {
				return !(!t || 1 !== t.nodeType)
			}, w.isArray = g || function (t) {
				return "[object Array]" === d.call(t)
			}, w.isObject = function (t) {
				var e = typeof t;
				return "function" === e || "object" === e && !!t
			}, w.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function (t) {
				w["is" + t] = function (e) {
					return d.call(e) === "[object " + t + "]"
				}
			}), w.isArguments(arguments) || (w.isArguments = function (t) {
				return w.has(t, "callee")
			}), "function" != typeof /./ && "object" != typeof Int8Array && (w.isFunction = function (t) {
				return "function" == typeof t || !1
			}), w.isFinite = function (t) {
				return isFinite(t) && !isNaN(parseFloat(t))
			}, w.isNaN = function (t) {
				return w.isNumber(t) && t !== +t
			}, w.isBoolean = function (t) {
				return t === !0 || t === !1 || "[object Boolean]" === d.call(t)
			}, w.isNull = function (t) {
				return null === t
			}, w.isUndefined = function (t) {
				return void 0 === t
			}, w.has = function (t, e) {
				return null != t && f.call(t, e)
			}, w.noConflict = function () {
				return s._ = a, this
			}, w.identity = function (t) {
				return t
			}, w.constant = function (t) {
				return function () {
					return t
				}
			}, w.noop = function () {}, w.property = T, w.propertyOf = function (t) {
				return null == t ? function () {} : function (e) {
					return t[e]
				}
			}, w.matcher = w.matches = function (t) {
				return t = w.extendOwn({}, t),
					function (e) {
						return w.isMatch(e, t)
					}
			}, w.times = function (t, e, n) {
				var r = Array(Math.max(0, t));
				e = _(e, n, 1);
				for (var o = 0; t > o; o++) r[o] = e(o);
				return r
			}, w.random = function (t, e) {
				return null == e && (e = t, t = 0), t + Math.floor(Math.random() * (e - t + 1))
			}, w.now = Date.now || function () {
				return (new Date).getTime()
			};
			var M = {
					"&": "&amp;",
					"<": "&lt;",
					">": "&gt;",
					'"': "&quot;",
					"'": "&#x27;",
					"`": "&#x60;"
				},
				O = w.invert(M),
				R = function (t) {
					var e = function (e) {
							return t[e]
						},
						n = "(?:" + w.keys(t).join("|") + ")",
						r = RegExp(n),
						o = RegExp(n, "g");
					return function (t) {
						return t = null == t ? "" : "" + t, r.test(t) ? t.replace(o, e) : t
					}
				};
			w.escape = R(M), w.unescape = R(O), w.result = function (t, e, n) {
				var r = null == t ? void 0 : t[e];
				return void 0 === r && (r = n), w.isFunction(r) ? r.call(t) : r
			};
			var L = 0;
			w.uniqueId = function (t) {
				var e = ++L + "";
				return t ? t + e : e
			}, w.templateSettings = {
				evaluate: /<%([\s\S]+?)%>/g,
				interpolate: /<%=([\s\S]+?)%>/g,
				escape: /<%-([\s\S]+?)%>/g
			};
			var q = /(.)^/,
				D = {
					"'": "'",
					"\\": "\\",
					"\r": "r",
					"\n": "n",
					"\u2028": "u2028",
					"\u2029": "u2029"
				},
				F = /\\|'|\r|\n|\u2028|\u2029/g,
				H = function (t) {
					return "\\" + D[t]
				};
			w.template = function (t, e, n) {
				!e && n && (e = n), e = w.defaults({}, e, w.templateSettings);
				var r = RegExp([(e.escape || q).source, (e.interpolate || q).source, (e.evaluate || q).source].join("|") + "|$", "g"),
					o = 0,
					i = "__p+='";
				t.replace(r, function (e, n, r, s, a) {
					return i += t.slice(o, a).replace(F, H), o = a + e.length, n ? i += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'" : r ? i += "'+\n((__t=(" + r + "))==null?'':__t)+\n'" : s && (i += "';\n" + s + "\n__p+='"), e
				}), i += "';\n", e.variable || (i = "with(obj||{}){\n" + i + "}\n"), i = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n";
				try {
					var s = new Function(e.variable || "obj", "_", i)
				} catch (a) {
					throw a.source = i, a
				}
				var c = function (t) {
						return s.call(this, t, w)
					},
					u = e.variable || "obj";
				return c.source = "function(" + u + "){\n" + i + "}", c
			}, w.chain = function (t) {
				var e = w(t);
				return e._chain = !0, e
			};
			var U = function (t, e) {
				return t._chain ? w(e).chain() : e
			};
			w.mixin = function (t) {
				w.each(w.functions(t), function (e) {
					var n = w[e] = t[e];
					w.prototype[e] = function () {
						var t = [this._wrapped];
						return p.apply(t, arguments), U(this, n.apply(w, t))
					}
				})
			}, w.mixin(w), w.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (t) {
				var e = c[t];
				w.prototype[t] = function () {
					var n = this._wrapped;
					return e.apply(n, arguments), "shift" !== t && "splice" !== t || 0 !== n.length || delete n[0], U(this, n)
				}
			}), w.each(["concat", "join", "slice"], function (t) {
				var e = c[t];
				w.prototype[t] = function () {
					return U(this, e.apply(this._wrapped, arguments))
				}
			}), w.prototype.value = function () {
				return this._wrapped
			}, w.prototype.valueOf = w.prototype.toJSON = w.prototype.value, w.prototype.toString = function () {
				return "" + this._wrapped
			}, "function" == typeof define && define.amd && define("underscore", [], function () {
				return w
			})
		}).call(this)
	}, {}],
	125: [function (t, e, n) {
		var r = t("./panels/container_panel"),
			userLang = navigator.language,
			o = new r({
				type: "resource",
				name: "figures",
				container: "figures",
				title: userLang.substring(0, 2) == "pt" ? "Ilustrações" : userLang.substring(0, 2) == "es" ? "Ilustraciones" : "Illustrations",
				icon: "fa-picture-o",
				references: ["figure_reference"],
				zoom: !0
			}),
			i = new r({
				type: "resource",
				name: "citations",
				container: "citations",
				title: userLang.substring(0, 2) == "pt" ? "Referências" : userLang.substring(0, 2) == "es" ? "Referencias" : "References",
				icon: "fa-link",
				references: ["citation_reference"]
			}),
			s = new r({
				type: "resource",
				name: "definitions",
				container: "definitions",
				title: "Material suplementar",
				icon: "fa-book",
				references: ["definition_reference"]
			}),
			a = new r({
				type: "resource",
				name: "info",
				container: "info",
				title: userLang.substring(0, 2) == "pt" ? "Informações" : userLang.substring(0, 2) == "es" ? "Información" : "Information",
				icon: "fa-info",
				references: ["contributor_reference"]
			});
		e.exports = [o, i, a, s]
	}, {
		"./panels/container_panel": 132
	}],
	126: [function (t, e, n) {
		var r = t("./workflows/toggle_resource_reference"),
			o = t("./workflows/follow_crossrefs"),
			i = t("./workflows/jump_to_top"),
			s = [new r, new o, new i];
		e.exports = s
	}, {
		"./workflows/follow_crossrefs": 148,
		"./workflows/jump_to_top": 149,
		"./workflows/toggle_resource_reference": 150
	}],
	127: [function (t, e, n) {
		e.exports = t("./lens")
	}, {
		"./lens": 128
	}],
	128: [function (t, e, n) {
		"use strict";
		var r = t("../substance/application"),
			o = t("./lens_controller"),
			i = t("lens/converter"),
			s = t("lens/article"),
			a = t("./panels/resource_panel_viewfactory"),
			c = t("./reader_controller"),
			u = t("./reader_view"),
			l = t("./panels/panel"),
			p = t("./panels/panel_controller"),
			h = t("./panels/panel_view"),
			d = t("./panels/container_panel"),
			f = t("./panels/container_panel_controller"),
			g = t("./panels/container_panel_view"),
			y = t("./workflows/workflow"),
			m = t("./default_panels"),
			v = t("./default_workflows"),
			b = function (t) {
				t = t || {}, t.routes = t.routes || this.getRoutes(), t.panels = t.panels || this.getPanels(), t.workflows = t.workflows || this.getWorkflows(), t.converters = this.getConverters(t.converterOptions), r.call(this, t), this.controller = t.controller || this.createController(t)
			};
		b.Prototype = function () {
			this.start = function () {
				r.prototype.start.call(this)
			}, this.render = function () {
				this.view = this.controller.createView(), this.$el.html(this.view.render().el)
			}, this.getRoutes = function () {
				return b.getDefaultRoutes()
			}, this.getPanels = function () {
				return b.getDefaultPanels()
			}, this.getWorkflows = function () {
				return b.getDefaultWorkflows()
			}, this.getConverters = function (t) {
				return [b.getDefaultConverter(t)]
			}, this.createController = function (t) {
				return new o(t)
			}
		}, b.Prototype.prototype = r.prototype, b.prototype = new b.Prototype, b.prototype.constructor = b, b.DEFAULT_ROUTES = [{
			route: ":context/:focussedNode/:fullscreen",
			name: "document-focussed-fullscreen",
			command: "openReader"
		}, {
			route: ":context/:focussedNode",
			name: "document-focussed",
			command: "openReader"
		}, {
			route: ":context",
			name: "document-context",
			command: "openReader"
		}, {
			route: "url/:url",
			name: "document",
			command: "openReader"
		}, {
			route: "",
			name: "document",
			command: "openReader"
		}], b.getDefaultRoutes = function () {
			return b.DEFAULT_ROUTES
		}, b.getDefaultPanels = function () {
			return m.slice(0)
		}, b.getDefaultWorkflows = function () {
			return v.slice(0)
		}, b.getDefaultConverter = function (t) {
			return new i(t)
		}, b.Article = s, b.ReaderController = c, b.ReaderView = u, b.Controller = o, b.LensController = o, b.Panel = l, b.PanelController = p, b.PanelView = h, b.ContainerPanel = d, b.ContainerPanelController = f, b.ContainerPanelView = g, b.ResourcePanelViewFactory = a, b.Workflow = y, e.exports = b
	}, {
		"../substance/application": 154,
		"./default_panels": 125,
		"./default_workflows": 126,
		"./lens_controller": 129,
		"./panels/container_panel": 132,
		"./panels/container_panel_controller": 133,
		"./panels/container_panel_view": 134,
		"./panels/panel": 141,
		"./panels/panel_controller": 142,
		"./panels/panel_view": 143,
		"./panels/resource_panel_viewfactory": 144,
		"./reader_controller": 146,
		"./reader_view": 147,
		"./workflows/workflow": 151,
		"lens/article": 6,
		"lens/converter": 122
	}],
	129: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../substance/util"),
			i = t("../substance/application").Controller,
			s = t("./lens_view"),
			a = t("./reader_controller"),
			c = t("lens/article"),
			u = t("lens/converter"),
			l = function (t) {
				i.call(this), this.config = t, this.Article = t.articleClass || c, this.converter = t.converter, this.converters = t.converters, this.converterOptions = r.extend({}, u.DefaultOptions, t.converterOptions), this.on("open:reader", this.openReader)
			};
		l.Prototype = function () {
			this.createView = function () {
				var t = new s(this);
				return this.view = t, t
			}, this.importXML = function (t) {
				var e = new DOMParser,
					n = e.parseFromString(t, "text/xml"),
					r = this.convertDocument(n);
				this.createReader(r, {
					panel: "toc"
				})
			}, this.updatePath = function (t) {
				var e = [];
				e.push(t.panel), t.focussedNode && e.push(t.focussedNode), t.fullscreen && e.push("fullscreen"), window.app.router.navigate(e.join("/"), {
					trigger: !1,
					replace: !1
				})
			}, this.createReader = function (t, e) {
				var n = this;
				this.reader = new a(t, e, this.config),
					this.reader.on("state-changed", function () {
						n.updatePath(n.reader.state)
					}), this.modifyState({
						context: "reader"
					})
			}, this.convertDocument = function (t) {
				for (var e, n = 0; !e && n < this.converters.length;) {
					var r = this.converters[n];
					r.test(t, this.config.document_url) && (e = r["import"](t)), n += 1
				}
				if (!e) throw new Error("No suitable converter found for this document", t);
				return e
			}, this.openReader = function (t, e, n) {
				var r = this,
					o = {
						panel: t || "toc",
						focussedNode: e,
						fullscreen: !!n
					};
				if (this.reader) this.reader.modifyState(o);
				else if ("lens_article.xml" === this.config.document_url) {
					var i = this.Article.describe();
					r.createReader(i, o)
				} else this.trigger("loading:started", "Loading article"), $.get(this.config.document_url).done(function (t) {
					var e;
					$.isXMLDoc(t) ? e = r.convertDocument(t) : ("string" == typeof t && (t = $.parseJSON(t)), e = r.Article.fromSnapshot(t)), "toc" === o.panel && e.getHeadings().length <= 2 && (o.panel = "info"), r.createReader(e, o)
				}).fail(function (t) {
					r.view.startLoading("Error during loading. Please try again."), console.error(t)
				})
			}
		}, l.Prototype.prototype = i.prototype, l.prototype = new l.Prototype, r.extend(l.prototype, o.Events), e.exports = l
	}, {
		"../substance/application": 154,
		"../substance/util": 175,
		"./lens_view": 131,
		"./reader_controller": 146,
		"lens/article": 6,
		"lens/converter": 122,
		underscore: 124
	}],
	130: [function (t, e, n) {
		var r = t("underscore"),
			o = t("../substance/application"),
			i = o.View,
			s = function (t, e) {
				i.call(this, e), this.docCtrl = t, this.options = e, this.document = t.getDocument(), this.options.viewFactory ? this.viewFactory = this.options.viewFactory : this.viewFactory = new this.document.constructor.ViewFactory(this.document.nodeTypes), this.$el.addClass("surface"), this.$nodes = $("<div>").addClass("nodes"), this.$el.append(this.$nodes)
			};
		s.Prototype = function () {
			this.render = function () {
				return this.$nodes.html(this.build()), this
			}, this.findNodeView = function (t) {
				return this.el.querySelector("*[data-id=" + t + "]")
			}, this.build = function () {
				var t = document.createDocumentFragment();
				r.each(this.nodes, function (t) {
					t.dispose()
				}), this.nodes = {};
				var e = this.docCtrl.container.getTopLevelNodes();
				return r.each(e, function (e) {
					var n = this.renderNodeView(e);
					this.nodes[e.id] = n, t.appendChild(n.el)
				}, this), t
			}, this.renderNodeView = function (t) {
				var e = this.viewFactory.createView(t, {
					topLevel: !0
				});
				return e.render(), e
			}
		}, s.Prototype.prototype = i.prototype, s.prototype = new s.Prototype, s.prototype.constructor = s, e.exports = s
	}, {
		"../substance/application": 154,
		underscore: 124
	}],
	131: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../substance/application").View,
			i = t("../substance/application").$$,
			s = function (t) {
				o.call(this), this.controller = t, this.$el.attr({
					id: "container"
				}), this.listenTo(this.controller, "state-changed", this.onStateChanged), this.listenTo(this.controller, "loading:started", this.startLoading), $(document).on("dragover", function () {
					return !1
				}), $(document).on("ondragend", function () {
					return !1
				}), $(document).on("drop", this.handleDroppedFile.bind(this))
			};
		s.Prototype = function () {
			this.handleDroppedFile = function () {
				var t = this.controller,
					e = event.dataTransfer.files,
					n = e[0],
					r = new FileReader;
				return r.onload = function (e) {
					t.importXML(e.target.result)
				}, r.readAsText(n), !1
			}, this.onStateChanged = function () {
				var t = this.controller.state;
				"reader" === t.context ? this.openReader() : console.log("Unknown application state: " + t)
			}, this.startLoading = function (t) {
				t || (t = "Loading article"), $(".spinner-wrapper .message").html(t), $("body").addClass("loading")
			}, this.stopLoading = function () {
				$("body").removeClass("loading")
			}, this.openReader = function () {
				var t = this.controller.reader.createView(),
					e = this;
				e.replaceMainView("reader", t), e.startLoading("Typesetting"), this.$("#main").css({
					opacity: 0
				}), r.delay(function () {
					e.stopLoading(), e.$("#main").css({
						opacity: 1
					})
				}, 1e3)
			}, this.replaceMainView = function (t, e) {
				$("body").removeClass().addClass("current-view " + t), this.mainView && this.mainView !== e && this.mainView.dispose(), this.mainView = e, this.$("#main").html(e.render().el)
			}, this.render = function () {
				return this.el.innerHTML = "", this.el.appendChild(i(".browser-not-supported", {
					text: "Sorry, your browser is not supported.",
					style: "display: none;"
				})), this.el.appendChild(i(".spinner-wrapper", {
					children: [i(".spinner"), i(".message", {
						html: "Loading article"
					})]
				})), this.el.appendChild(i("#main")), this
			}, this.dispose = function () {
				this.stopListening(), this.mainView && this.mainView.dispose()
			}
		}, s.Prototype.prototype = o.prototype, s.prototype = new s.Prototype, e.exports = s
	}, {
		"../substance/application": 154,
		underscore: 124
	}],
	132: [function (t, e, n) {
		"use strict";
		var r = t("./panel"),
			o = t("./container_panel_controller"),
			i = function (t) {
				r.call(this, t)
			};
		i.Prototype = function () {
			this.createController = function (t) {
				return new o(t, this.config)
			}
		}, i.Prototype.prototype = r.prototype, i.prototype = new i.Prototype, e.exports = i
	}, {
		"./container_panel_controller": 133,
		"./panel": 141
	}],
	133: [function (t, e, n) {
		"use strict";
		var r = t("../../substance/document"),
			o = t("./panel_controller"),
			i = t("./resource_panel_viewfactory"),
			s = t("./container_panel_view"),
			a = function (t, e) {
				o.call(this, t, e), this.docCtrl = new r.Controller(t, {
					view: e.container
				})
			};
		a.Prototype = function () {
			this.createView = function () {
				var t, e = this.getDocument();
				if ("resource" === this.config.type) t = this.config.createViewFactory ? this.config.createViewFactory(e, this.config) : new i(e.nodeTypes, this.config);
				else {
					var n = e.constructor.ViewFactory;
					t = new n(e.nodeTypes, this.config)
				}
				return this.viewFactory = t, new s(this, t, this.config)
			}, this.getContainer = function () {
				return this.docCtrl.getContainer()
			}
		}, a.Prototype.prototype = o.prototype, a.prototype = new a.Prototype, e.exports = a
	}, {
		"../../substance/document": 167,
		"./container_panel_view": 134,
		"./panel_controller": 142,
		"./resource_panel_viewfactory": 144
	}],
	134: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("./surface_scrollbar"),
			i = t("../lens_surface"),
			s = t("./panel_view"),
			a = 40,
			c = function (t, e, n) {
				s.call(this, t, n), this.surface = new i(t.docCtrl, {
					editable: !1,
					viewFactory: e
				}), this.docCtrl = t.docCtrl, this.scrollbar = new o(this.surface), this._onScroll = r.bind(this.onScroll, this), this.surface.$el.on("scroll", this._onScroll), this.surface.$el.addClass("resource-view").addClass(n.container), this.el.appendChild(this.surface.el), this.el.appendChild(this.scrollbar.el), this.$activeResource = null
			};
		c.Prototype = function () {
			this.render = function () {
				return 0 === this.getContainer().getLength() ? (this.hideToggle(), this.hide()) : (this.surface.render(), this.scrollbar.render()), this
			}, this.getContainer = function () {
				return this.docCtrl.container
			}, this.onScroll = function () {
				this.scrollbar.onScroll()
			}, this.hasScrollbar = function () {
				return !0
			}, this.scrollTo = function (t) {
				var e = this.findNodeView(t);
				if (e) {
					var n, r = $(e),
						o = ($(window).height(), this.surface.$el.height());
					n = this.surface.$el.scrollTop();
					var i, s = r.offset().top,
						c = r.height();
					if (s > 0 && o > s + c || s >= 0 && o > s) return;
					i = n + s - a, this.surface.$el.scrollTop(i), this.scrollbar.update()
				} else console.info("ContainerPanelView.scrollTo(): Unknown resource '%s'", t)
			}, this.findNodeView = function (t) {
				return this.surface.findNodeView(t)
			}, this.addHighlight = function (t, e) {
				s.prototype.addHighlight.call(this, t, e);
				var n = this.getDocument().get(t);
				n && this.scrollbar.addHighlight(t, e + " " + n.type)
			}, this.removeHighlights = function () {
				s.prototype.removeHighlights.call(this), this.scrollbar.removeHighlights(), this.scrollbar.update()
			}, this.update = function () {
				this.scrollbar.update()
			}, this.hide = function () {
				this.hidden || s.prototype.hide.call(this)
			}, this.show = function () {
				this.scrollbar.update(), s.prototype.show.call(this)
			}
		}, c.Prototype.prototype = s.prototype, c.prototype = new c.Prototype, c.prototype.constructor = c, e.exports = c
	}, {
		"../lens_surface": 130,
		"./panel_view": 143,
		"./surface_scrollbar": 145,
		underscore: 124
	}],
	135: [function (t, e, n) {
		"use strict";
		var r = t("../container_panel"),
			o = t("./content_panel_controller"),
			userLang = navigator.language,
			i = function () {
				r.call(this, {
					name: "content",
					type: "document",
					container: "content",
					label: "Contents",
					title: userLang.substring(0, 2) == "pt" ? "Conteúdo" : userLang.substring(0, 2) == "es" ? "Contenido" : "Content",
					icon: "fa-align-left"
				})
			};
		i.Prototype = function () {
			this.createController = function (t) {
				return new o(t, this.config)
			}
		}, i.Prototype.prototype = r.prototype, i.prototype = new i.Prototype, e.exports = i
	}, {
		"../container_panel": 132,
		"./content_panel_controller": 136
	}],
	136: [function (t, e, n) {
		"use strict";
		var r = t("../container_panel_controller"),
			o = t("./content_panel_view"),
			i = function (t, e) {
				r.call(this, t, e)
			};
		i.Prototype = function () {
			this.createView = function () {
				if (!this.view) {
					var t = this.getDocument(),
						e = t.constructor.ViewFactory,
						n = new e(t.nodeTypes, this.config);
					this.view = new o(this, n, this.config)
				}
				return this.view
			}
		}, i.Prototype.prototype = r.prototype, i.prototype = new i.Prototype, e.exports = i
	}, {
		"../container_panel_controller": 133,
		"./content_panel_view": 137
	}],
	137: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../container_panel_view"),
			i = t("./toc_panel_view"),
			s = 0,
			a = 1,
			c = function (t, e, n) {
				o.call(this, t, e, n), this.tocView = new i(t, e, r.extend({}, n, {
					type: "resource",
					name: "toc"
				})), this.tocNodeElements = {}, this._onTocItemSelected = r.bind(this.onTocItemSelected, this), this.resources = t.getDocument().addIndex("referenceByTarget", {
					types: ["resource_reference"],
					property: "target"
				}), this.tocView.toc.on("toc-item-selected", this._onTocItemSelected), this.$el.addClass("document")
			};
		c.Prototype = function () {
			this.dispose = function () {
				this.tocView.toc.off("toc-item-selected", this._onTocItemSelected), this.stopListening()
			}, this.getTocView = function () {
				return this.tocView
			}, this.onScroll = function () {
				var t = this.surface.$el.scrollTop();
				this.scrollbar.update(), this.markActiveHeading(t)
			}, this.onTocItemSelected = function (t) {
				var e = this.findNodeView(t);
				if (e) {
					var n = $(e).position().top + s;
					this.surface.$el.scrollTop(n)
				}
			}, this.markActiveHeading = function (t) {
				var e = $(".nodes").height(),
					n = this.getDocument().getTocNodes(),
					o = function (t) {
						var e = this.tocNodeElements[t];
						return e || (e = this.tocNodeElements[t] = this.findNodeView(t)), e
					}.bind(this);
				if (0 !== n.length) {
					var i;
					o(n[0].id);
					if (i = n[0].id, t + this.$el.height() >= e) i = r.last(n).id;
					else
						for (var s = n.length - 1; s >= 1; s--) {
							var c = n[s],
								u = o(c.id);
							if (u) {
								var l = $(u).offset().top - a;
								if (0 >= l) {
									i = u.dataset.id;
									break
								}
							} else console.error("Could not find element for node %s", c.id)
						}
					this.tocView.setActiveNode(i)
				}
			}, this.markReferencesTo = function (t) {
				var e = this.resources.get(t);
				r.each(e, function (t) {
					$(this.findNodeView(t.id)).addClass("active")
				}, this)
			}, this.removeHighlights = function () {
				o.prototype.removeHighlights.call(this), this.$el.find(".content-node.active").removeClass("active"), this.$el.find(".annotation.active").removeClass("active")
			}
		}, c.Prototype.prototype = o.prototype, c.prototype = new c.Prototype, c.prototype.constructor = c, e.exports = c
	}, {
		"../container_panel_view": 134,
		"./toc_panel_view": 139,
		underscore: 124
	}],
	138: [function (t, e, n) {
		e.exports = t("./content_panel")
	}, {
		"./content_panel": 135
	}],
	139: [function (t, e, n) {
		"use strict";
		var r = t("./toc_view"),
			o = t("../panel_view"),
			i = function (t, e, n) {
				o.call(this, t, n), this.toc = new r(t.getDocument(), e)
			};
		i.Prototype = function () {
			this.render = function () {
				return this.el.appendChild(this.toc.render().el), this
			}, this.setActiveNode = function (t) {
				this.toc.setActiveNode(t)
			}, this.onToggle = function (t) {
				this.trigger("toggle", "toc"), t.preventDefault(), t.stopPropagation()
			}
		}, i.Prototype.prototype = o.prototype, i.prototype = new i.Prototype, i.prototype.constructor = i, e.exports = i
	}, {
		"../panel_view": 143,
		"./toc_view": 140
	}],
	140: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/application").View,
			o = (t("../../../substance/application").$$, t("../../../substance/data")),
			i = (o.Graph.Index, t("underscore")),
			s = function (t, e) {
				r.call(this), this.doc = t, this.viewFactory = e, this.$el.addClass("toc")
			};
		s.Prototype = function () {
			this.render = function () {
				var t = -1,
					e = this.doc.getTocNodes();
				return e.length < 2 ? this : (i.each(e, function (e) {
					var n = this.viewFactory.createView(e),
						r = e.getLevel(); - 1 === r ? r = t + 1 : t = r;
					var o = n.renderTocItem(),
						s = $(o);
					o.id = "toc_" + e.id, s.addClass("heading-ref"), s.addClass("level-" + r), s.click(i.bind(this.onClick, this, e.id)), this.el.appendChild(o)
				}, this), this)
			}, this.setActiveNode = function (t) {
				this.$(".heading-ref.active").removeClass("active"), this.$("#toc_" + t).addClass("active")
			}, this.onClick = function (t) {
				this.trigger("toc-item-selected", t)
			}
		}, s.Prototype.prototype = r.prototype, s.prototype = new s.Prototype, e.exports = s
	}, {
		"../../../substance/application": 154,
		"../../../substance/data": 160,
		underscore: 124
	}],
	141: [function (t, e, n) {
		"use strict";
		var r = function (t) {
			this.config = t, this.config.label = t.title
		};
		r.Prototype = function () {
			this.createController = function (t) {
				throw new Error("this method is abstract")
			}, this.getName = function () {
				return this.config.name
			}, this.getConfig = function () {
				return this.config
			}
		}, r.prototype = new r.Prototype, r.prototype.constructor = r, e.exports = r
	}, {}],
	142: [function (t, e, n) {
		"use strict";
		var r = t("../../substance/application").Controller,
			o = (t("underscore"), t("../../substance/util"), function (t, e) {
				this.document = t, this.config = e
			});
		o.Prototype = function () {
			r.prototype;
			this.createView = function () {
				throw new Error("this is an abstract method")
			}, this.getConfig = function () {
				return this.config
			}, this.getName = function () {
				return this.config.name
			}, this.getDocument = function () {
				return this.document
			}
		}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, e.exports = o
	}, {
		"../../substance/application": 154,
		"../../substance/util": 175,
		underscore: 124
	}],
	143: [function (t, e, n) {
		var r = t("underscore"),
			o = t("../../substance/application"),
			i = o.$$,
			s = o.View,
			a = function (t, e) {
				s.call(this), this.controller = t, this.config = e, this.doc = t.getDocument(), this.name = e.name, this.toggleEl = i("a.context-toggle." + this.name, {
					href: "#",
					title: this.config.title,
					html: '<i class="fa ' + this.config.icon + '"></i> ' + this.config.title
				}), this.$toggleEl = $(this.toggleEl), this.$el.addClass("panel").addClass(this.name), "resource" === this.config.type && this.$el.addClass("resource-view"), this._onToggle = r.bind(this.onToggle, this), this._onToggleResource = r.bind(this.onToggleResource, this), this._onToggleResourceReference = r.bind(this.onToggleResourceReference, this), this._onToggleFullscreen = r.bind(this.onToggleFullscreen, this), this.$toggleEl.click(this._onToggle), this.$el.on("click", ".action-toggle-resource", this._onToggleResource), this.$el.on("click", ".toggle-fullscreen", this._onToggleFullscreen), this.$el.on("click", ".annotation.resource-reference", this._onToggleResourceReference), this.highlightedNodes = []
			};
		a.Prototype = function () {
			this.dispose = function () {
				this.$toggleEl.off("click", this._onClick), this.$el.off("scroll", this._onScroll), this.$el.off("click", ".a.action-toggle-resource", this._onToggleResource), this.$el.off("click", ".a.toggle-fullscreen", this._onToggleFullscreen), this.$el.off("click", ".annotation.reference", this._onToggleResourceReference), this.stopListening()
			}, this.onToggle = function (t) {
				this.trigger("toggle", this.name), t.preventDefault(), t.stopPropagation()
			}, this.getToggleControl = function () {
				return this.toggleEl
			}, this.hasScrollbar = function () {
				return !1
			}, this.show = function () {
				this.$el.removeClass("hidden"), this.hidden = !1
			}, this.hide = function () {
				this.hidden || (this.$el.addClass("hidden"), this.$toggleEl.removeClass("active"), this.hidden = !0)
			}, this.isHidden = function () {
				return this.hidden
			}, this.activate = function () {
				this.show(), $("#main .article")[0].dataset.context = this.name, this.$toggleEl.addClass("active")
			}, this.addHighlight = function (t, e) {
				var n = this.findNodeView(t);
				if (n) {
					var r = $(n);
					r.addClass(e), this.highlightedNodes.push({
						$el: r,
						cssClass: e
					})
				}
			}, this.removeHighlights = function () {
				for (var t = 0; t < this.highlightedNodes.length; t++) {
					var e = this.highlightedNodes[t];
					e.$el.removeClass(e.cssClass)
				}
				this.highlightedNodes = []
			}, this.showToggle = function () {
				this.$toggleEl.removeClass("hidden")
			}, this.hideToggle = function () {
				this.$toggleEl.addClass("hidden")
			}, this.getDocument = function () {
				return this.doc
			}, this.findNodeView = function (t) {
				return this.el.querySelector("*[data-id=" + t + "]")
			}, this.onToggleResource = function (t) {
				t.preventDefault(), t.stopPropagation();
				var e = $(t.currentTarget).parents(".content-node")[0],
					n = e.dataset.id;
				this.trigger("toggle-resource", this.name, n, e)
			}, this.onToggleResourceReference = function (t) {
				t.preventDefault(), t.stopPropagation();
				var e = t.currentTarget,
					n = t.currentTarget.dataset.id;
				this.trigger("toggle-resource-reference", this.name, n, e)
			}, this.onToggleFullscreen = function (t) {
				t.preventDefault(), t.stopPropagation();
				var e = $(t.currentTarget).parents(".content-node")[0],
					n = e.dataset.id;
				this.trigger("toggle-fullscreen", this.name, n, e)
			}
		}, a.Prototype.prototype = s.prototype, a.prototype = new a.Prototype, a.prototype.constructor = a, e.exports = a
	}, {
		"../../substance/application": 154,
		underscore: 124
	}],
	144: [function (t, e, n) {
		var r = t("../../article").ViewFactory,
			o = function (t, e) {
				r.call(this, t), this.options = e || {}, void 0 === this.options.header && (this.options.header = !0), void 0 === this.options.zoom && (this.options.zoom = o.enableZoom)
			};
		o.Prototype = function () {
			this.createView = function (t, e, n) {
				e = e || {};
				var r = this.getNodeViewClass(t, n);
				e.topLevel && r.prototype.isResourceView && this.options.header && (e.header = !0, r.prototype.isZoomable && this.options.zoom && (e.zoom = !0));
				var o = new r(t, this, e);
				return o
			}
		}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, o.enableZoom = !1, e.exports = o
	}, {
		"../../article": 6
	}],
	145: [function (t, e, n) {
		"use strict";
		var r = t("../../substance/application").View,
			o = t("../../substance/application").$$,
			i = t("underscore"),
			s = function (t) {
				r.call(this), this.surface = t, this.$nodes = this.surface.$nodes, this.$el.addClass("surface-scrollbar"), this.$el.addClass(t.docCtrl.getContainer().id), this.overlays = [], i.bindAll(this, "mouseDown", "mouseUp", "mouseMove", "updateVisibleArea"), this.$el.mousedown(this.mouseDown), $(window).mousemove(this.mouseMove), $(window).mouseup(this.mouseUp)
			};
		s.Prototype = function () {
			this.render = function () {
				var t = this.$nodes.height(),
					e = this.surface.$el.height();
				return this.factor = t / e, this.visibleArea = o(".visible-area"), this.scrollTop = this.surface.$el.scrollTop(), this.el.innerHTML = "", this.el.appendChild(this.visibleArea), this.updateVisibleArea(), this
			}, this.updateVisibleArea = function () {
				$(this.visibleArea).css({
					top: this.scrollTop / this.factor,
					height: this.surface.$el.height() / this.factor
				})
			}, this.addOverlay = function (t) {
				var e = $("<div>").addClass("node overlay");
				return this.overlays.push({
					el: t,
					$overlay: e
				}), this.$el.append(e), e
			}, this.updateOverlay = function (t, e) {
				var n = $(t),
					r = n.outerHeight(!0) / this.factor,
					o = (n.offset().top - this.surfaceTop) / this.factor;
				r < s.OverlayMinHeight && (r = s.OverlayMinHeight, o -= .5 * s.OverlayMinHeight), e.css({
					height: r,
					top: o
				})
			}, this.addHighlight = function (t, e) {
				var n = this.surface.findNodeView(t);
				if (n) {
					var r = this.addOverlay(n);
					return this.updateOverlay(n, r), r.addClass(e), r[0]
				}
			}, this.addHighlights = function (t, e) {
				for (var n = [], r = 0; r < t.length; r++) {
					var o = this.addHighlight(t[r], e);
					n.push(o)
				}
				return this.update(), n
			}, this.removeHighlights = function () {
				for (var t = 0; t < this.overlays.length; t++) {
					var e = this.overlays[t];
					e.$overlay.remove()
				}
			}, this.update = function () {
				var t = this.$nodes.height(),
					e = this.surface.$el.height();
				t > e ? $(this.el).removeClass("hidden") : $(this.el).addClass("hidden"), this.factor = t / e, this.surfaceTop = this.$nodes.offset().top, this.scrollTop = this.surface.$el.scrollTop(), this.updateVisibleArea();
				for (var n = 0; n < this.overlays.length; n++) {
					var r = this.overlays[n];
					this.updateOverlay(r.el, r.$overlay)
				}
			}, this.mouseDown = function (t) {
				this._mouseDown = !0;
				var e = t.pageY;
				return t.target !== this.visibleArea ? (this.offset = $(this.visibleArea).height() / 2, this.mouseMove(t)) : this.offset = e - $(this.visibleArea).position().top, !1
			}, this.mouseUp = function () {
				this._mouseDown = !1
			}, this.mouseMove = function (t) {
				if (this._mouseDown) {
					var e = t.pageY,
						n = (e - this.offset) * this.factor;
					this.scrollTop = this.surface.$el.scrollTop(n), this.updateVisibleArea()
				}
			}, this.onScroll = function () {
				this.surface && (this.scrollTop = this.surface.$el.scrollTop(), this.updateVisibleArea())
			}
		}, s.Prototype.prototype = r.prototype, s.prototype = new s.Prototype, s.OverlayMinHeight = 5, e.exports = s
	}, {
		"../../substance/application": 154,
		underscore: 124
	}],
	146: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../substance/application").Controller,
			i = t("./reader_view"),
			s = t("./panels/content"),
			a = function (t, e, n) {
				this.__document = t, this.options = n || {}, this.panels = n.panels, this.contentPanel = new s(t), this.panelCtrls = {}, this.panelCtrls.content = this.contentPanel.createController(t), r.each(this.panels, function (e) {
					this.panelCtrls[e.getName()] = e.createController(t)
				}, this), this.workflows = n.workflows || [], this.state = e, this.currentPanel = "toc"
			};
		a.Prototype = function () {
			this.createView = function () {
				return this.view || (this.view = new i(this)), this.view
			}, this.switchPanel = function (t) {
				this.currentPanel = t, this.modifyState({
					panel: t,
					focussedNode: null,
					fullscreen: !1
				})
			}, this.getDocument = function () {
				return this.__document
			}
		}, a.Prototype.prototype = o.prototype, a.prototype = new a.Prototype, e.exports = a
	}, {
		"../substance/application": 154,
		"./panels/content": 138,
		"./reader_view": 147,
		underscore: 124
	}],
	147: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../substance/application").View,
			i = t("../substance/data"),
			s = i.Graph.Index,
			a = t("../substance/application").$$,
			c = function (t) {
				o.call(this), this.readerCtrl = t, this.doc = this.readerCtrl.getDocument(), this.$el.addClass("article"), this.$el.addClass(this.doc.schema.id), this.bodyScroll = {}, this.contentView = t.panelCtrls.content.createView(), this.tocView = this.contentView.getTocView(), this.panelViews = {}, this.panelForRef = {}, r.each(t.panels, function (e) {
					var n = e.getName(),
						o = t.panelCtrls[n];
					this.panelViews[n] = o.createView(), r.each(e.config.references, function (t) {
						this.panelForRef[t] = n
					}, this)
				}, this), this.panelViews.toc = this.tocView, this.resources = new s(this.readerCtrl.getDocument(), {
					types: ["resource_reference"],
					property: "target"
				}), this.lastWorkflow = null, this.lastPanel = "toc", this._onTogglePanel = r.bind(this.switchPanel, this), this.listenTo(this.readerCtrl, "state-changed", this.updateState), this.listenTo(this.tocView, "toggle", this._onTogglePanel), r.each(this.panelViews, function (t) {
					this.listenTo(t, "toggle", this._onTogglePanel), this.listenTo(t, "toggle-resource", this.onToggleResource), this.listenTo(t, "toggle-resource-reference", this.onToggleResourceReference), this.listenTo(t, "toggle-fullscreen", this.onToggleFullscreen)
				}, this), this.listenTo(this.contentView, "toggle", this._onTogglePanel), this.listenTo(this.contentView, "toggle-resource", this.onToggleResource), this.listenTo(this.contentView, "toggle-resource-reference", this.onToggleResourceReference), this.listenTo(this.contentView, "toggle-fullscreen", this.onToggleFullscreen), r.each(this.readerCtrl.workflows, function (t) {
					t.attach(this.readerCtrl, this)
				}, this), $(window).resize(r.debounce(r.bind(function () {
					this.contentView.scrollbar.update();
					var t = this.panelViews[this.readerCtrl.state.panel];
					t && t.hasScrollbar() && t.scrollbar.update()
				}, this), 1))
			};
		c.Prototype = function () {
			this.render = function () {
				var t = document.createDocumentFragment();
				t.appendChild(this.contentView.render().el);
				var e = a(".scrollbar-cover");
				this.contentView.el.appendChild(e);
				var n = a(".context-toggles");
				n.appendChild(this.tocView.getToggleControl()), this.tocView.on("toggle", this._onClickPanel), r.each(this.readerCtrl.panels, function (t) {
					var e = this.panelViews[t.getName()],
						r = e.getToggleControl();
					n.appendChild(r), e.on("toggle", this._onClickPanel)
				}, this);
				var o = a(".resources");
				o.appendChild(this.tocView.render().el), r.each(this.readerCtrl.panels, function (t) {
					var e = this.panelViews[t.getName()];
					o.appendChild(e.render().el)
				}, this);
				var i = a(".menu-bar");
				return i.appendChild(n), o.appendChild(i), t.appendChild(o), this.el.appendChild(t), r.delay(r.bind(function () {
					this.updateState();
					var t = this;
					window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]), window.MathJax.Hub.Queue(function () {
						t.updateState()
					})
				}, this), 1), this
			}, this.dispose = function () {
				r.each(this.workflows, function (t) {
					t.detach()
				}), this.contentView.dispose(), r.each(this.panelViews, function (t) {
					t.off("toggle", this._onClickPanel), t.dispose()
				}, this), this.resources.dispose(), this.stopListening()
			}, this.getState = function () {
				return this.readerCtrl.state
			}, this.switchPanel = function (t) {
				this.readerCtrl.switchPanel(t), this.lastPanel = t
			}, this.updateState = function () {
				var t, e = this,
					n = this.readerCtrl.state,
					o = {
						focussedNode: n.focussedNode ? this.doc.get(n.focussedNode) : null
					},
					i = "content" === n.panel ? this.contentView : this.panelViews[n.panel];
				if (r.each(this.panelViews, function (t) {
						t.isHidden() || t.hide()
					}), this.contentView.removeHighlights(), r.each(this.panelViews, function (t) {
						t.removeHighlights()
					}), n.focussedNode) {
					var s = ["focussed", "highlighted"];
					n.fullscreen && s.push("fullscreen"), i.addHighlight(n.focussedNode, s.join(" ")), i.scrollTo(n.focussedNode)
				}
				if (this.lastWorkflow && (t = this.lastWorkflow.handleStateUpdate(n, o)), !t)
					for (var a = 0; a < this.readerCtrl.workflows.length; a++) {
						var c = this.readerCtrl.workflows[a];
						if (c !== this.lastWorkflow && c.handlesStateUpdate && (t = c.handleStateUpdate(n, o))) {
							this.lastWorkflow = c;
							break
						}
					}
				if (!t)
					if ("content" !== n.panel) {
						var u = this.panelViews[n.panel];
						if (this.showPanel(n.panel), n.focussedNode) {
							var l = this.resources.get(n.focussedNode);
							r.each(l, function (t) {
								this.contentView.addHighlight(t.id, "highlighted ")
							}, this), u.hasScrollbar() && u.scrollTo(n.focussedNode)
						}
					} else this.showPanel("toc");
				e.updateScrollbars(), r.delay(function () {
					e.updateScrollbars()
				}, 2e3)
			}, this.updateScrollbars = function () {
				this.readerCtrl.state;
				this.contentView.scrollbar.update(), r.each(this.panelViews, function (t) {
					t.hasScrollbar() && t.scrollbar.update()
				})
			}, this.showPanel = function (t) {
				this.panelViews[t] ? (this.panelViews[t].activate(), this.el.dataset.context = t) : "content" === t && (this.panelViews.toc.activate(), this.el.dataset.context = t)
			}, this.getPanelView = function (t) {
				return this.panelViews[t]
			}, this.onToggleResource = function (t, e, n) {
				n.classList.contains("highlighted") ? this.readerCtrl.modifyState({
					panel: t,
					focussedNode: null,
					fullscreen: !1
				}) : this.readerCtrl.modifyState({
					panel: t,
					focussedNode: e
				})
			}, this.onToggleResourceReference = function (t, e, n) {
				n.classList.contains("highlighted") ? this.readerCtrl.modifyState({
					panel: this.lastPanel,
					focussedNode: null,
					fullscreen: !1
				}) : this.readerCtrl.modifyState({
					panel: "content",
					focussedNode: e,
					fullscreen: !1
				})
			}, this.onToggleFullscreen = function (t, e) {
				var n = !this.readerCtrl.state.fullscreen;
				this.readerCtrl.modifyState({
					panel: t,
					focussedNode: e,
					fullscreen: n
				})
			}
		}, c.Prototype.prototype = o.prototype, c.prototype = new c.Prototype, c.prototype.constructor = c, e.exports = c
	}, {
		"../substance/application": 154,
		"../substance/data": 160,
		underscore: 124
	}],
	148: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("./workflow"),
			i = function () {
				o.apply(this, arguments), this._followCrossReference = r.bind(this.followCrossReference, this)
			};
		i.Prototype = function () {
			this.registerHandlers = function () {
				this.readerView.$el.on("click", ".annotation.cross_reference", this._followCrossReference)
			}, this.unRegisterHandlers = function () {
				this.readerView.$el.off("click", ".annotation.cross_reference", this._followCrossReference)
			}, this.followCrossReference = function (t) {
				t.preventDefault(), t.stopPropagation();
				var e = t.currentTarget.dataset.id,
					n = this.readerCtrl.getDocument().get(e);
				this.readerView.contentView.scrollTo(n.target)
			}
		}, i.Prototype.prototype = o.prototype, i.prototype = new i.Prototype, e.exports = i
	}, {
		"./workflow": 151,
		underscore: 124
	}],
	149: [function (t, n, r) {
		"use strict";
		var o = t("underscore"),
			i = t("./workflow"),
			s = function () {
				i.apply(this, arguments), this._gotoTop = o.bind(this.gotoTop, this)
			};
		s.Prototype = function () {
			this.registerHandlers = function () {
				this.readerView.$el.on("click", ".document .content-node.heading .top", this._gotoTop)
			}, this.unRegisterHandlers = function () {
				this.readerView.$el.off("click", ".document .content-node.heading .top", this._gotoTop)
			}, this.gotoTop = function () {
				e.preventDefault(), e.stopPropagation(), this.readerCtrl.contentView.jumpToNode("cover")
			}
		}, s.Prototype.prototype = i.prototype, s.prototype = new s.Prototype, n.exports = s
	}, {
		"./workflow": 151,
		underscore: 124
	}],
	150: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("./workflow"),
			i = function () {
				o.apply(this, arguments)
			};
		i.Prototype = function () {
			this.registerHandlers = function () {}, this.unRegisterHandlers = function () {}, this.handlesStateUpdate = !0, this.handleStateUpdate = function (t, e) {
				if (e.focussedNode && this.readerView.panelForRef[e.focussedNode.type]) {
					var n = e.focussedNode,
						o = this.readerView.panelForRef[n.type],
						i = this.readerView.panelViews[o],
						s = this.readerView.contentView,
						a = n.target;
					i.activate();
					var c = ["highlighted"];
					i.addHighlight(a, c.join(" ")), i.scrollTo(a);
					var u = this.readerView.resources.get(a);
					return delete u[n.id], r.each(u, function (t) {
						s.addHighlight(t.id, "highlighted")
					}, this), !0
				}
				return !1
			}
		}, i.Prototype.prototype = o.prototype, i.prototype = new i.Prototype, e.exports = i
	}, {
		"./workflow": 151,
		underscore: 124
	}],
	151: [function (t, e, n) {
		"use strict";
		var r = function () {
			this.readerController = null, this.readerView = null
		};
		r.Prototype = function () {
			this.attach = function (t, e) {
				this.readerCtrl = t, this.readerView = e, this.registerHandlers()
			}, this.detach = function () {
				this.unRegisterHandlers(), this.readerView = null, this.readerController = null
			}, this.registerHandlers = function () {
				throw new Error("This method is abstract")
			}, this.unRegisterHandlers = function () {
				throw new Error("This method is abstract")
			}, this.handlesStateUpdate = !1, this.handleStateUpdate = function (t, e) {
				throw new Error("This method is abstract")
			}
		}, r.prototype = new r.Prototype, e.exports = r
	}, {}],
	152: [function (t, e, n) {
		"use strict";
		var r = t("./view"),
			o = t("./router"),
			i = (t("../../substance/util"), t("underscore")),
			s = function (t) {
				r.call(this), this.config = t
			};
		s.Prototype = function () {
			this.initRouter = function () {
				this.router = new o, i.each(this.config.routes, function (t) {
					this.router.route(t.route, t.name, i.bind(this.controller[t.command], this.controller))
				}, this), o.history.start()
			}, this.start = function () {
				this.$el = $("body"), this.el = this.$el[0], this.render(), this.initRouter()
			}
		}, s.Prototype.prototype = r.prototype, s.prototype = new s.Prototype, e.exports = s
	}, {
		"../../substance/util": 175,
		"./router": 156,
		"./view": 157,
		underscore: 124
	}],
	153: [function (t, e, n) {
		"use strict";
		var r = t("../../substance/util"),
			o = t("underscore"),
			i = function (t) {
				this.state = {}, this.context = null
			};
		i.Prototype = function () {
			this.updateState = function (t, e) {
				console.error("updateState is deprecated, use modifyState. State is now a rich object where context replaces the old state variable");
				var n = this.context;
				this.context = t, this.state = e, this.trigger("state-changed", this.context, n, e)
			}, this.modifyState = function (t) {
				var e = this.state.context;
				o.extend(this.state, t), t.context && t.context !== e && this.trigger("context-changed", t.context), this.trigger("state-changed", this.state.context)
			}
		}, i.Prototype.prototype = r.Events, i.prototype = new i.Prototype, e.exports = i
	}, {
		"../../substance/util": 175,
		underscore: 124
	}],
	154: [function (t, e, n) {
		"use strict";
		var r = t("./application");
		r.View = t("./view"), r.Router = t("./router"), r.Controller = t("./controller"), r.ElementRenderer = t("./renderers/element_renderer"), r.$$ = r.ElementRenderer.$$, e.exports = r
	}, {
		"./application": 152,
		"./controller": 153,
		"./renderers/element_renderer": 155,
		"./router": 156,
		"./view": 157
	}],
	155: [function (t, e, n) {
		"use strict";
		var r = t("../../../substance/util"),
			o = r.RegExp,
			i = function (t) {
				return this.attributes = t, this.tagName = t.tag, this.children = t.children || [], this.text = t.text || "", this.html = t.html, delete t.children, delete t.text, delete t.html, delete t.tag, this.render()
			};
		i.Prototype = function () {
			this.render = function () {
				var t = document.createElement(this.tagName);
				this.html ? t.innerHTML = this.html : t.textContent = this.text;
				for (var e in this.attributes) {
					var n = this.attributes[e];
					t.setAttribute(e, n)
				}
				for (var r = 0; r < this.children.length; r++) {
					var o = this.children[r];
					t.appendChild(o)
				}
				return this.el = t, t
			}
		};
		var s = function (t, e) {
			var e = e || {},
				n = /^([a-zA-Z0-9]*)/.exec(t);
			e.tag = n && n[1] ? n[1] : "div";
			var r = /#([a-zA-Z0-9_]*)/.exec(t);
			r && r[1] && (e.id = r[1]);
			var s = new o(/\.([a-zA-Z0-9_-]*)/g);
			return e["class"] || (e["class"] = s.match(t).map(function (t) {
				return t.match[1]
			}).join(" ")), new i(e)
		};
		i.$$ = s, i.Prototype.prototype = r.Events, i.prototype = new i.Prototype, e.exports = i
	}, {
		"../../../substance/util": 175
	}],
	156: [function (t, e, n) {
		"use strict";
		var r = t("../../substance/util"),
			o = t("underscore"),
			i = function (t) {
				t || (t = {}), t.routes && (this.routes = t.routes), this._bindRoutes(), this.initialize.apply(this, arguments)
			},
			s = /\((.*?)\)/g,
			a = /(\(\?)?:\w+/g,
			c = /\*\w+/g,
			u = /[\-{}\[\]+?.,\\\^$|#\s]/g;
		o.extend(i.prototype, r.Events, {
			initialize: function () {},
			route: function (t, e, n) {
				o.isRegExp(t) || (t = this._routeToRegExp(t)), o.isFunction(e) && (n = e, e = ""), n || (n = this[e]);
				var r = this;
				return i.history.route(t, function (o) {
					var s = r._extractParameters(t, o);
					n && n.apply(r, s), r.trigger.apply(r, ["route:" + e].concat(s)), r.trigger("route", e, s), i.history.trigger("route", r, e, s)
				}), this
			},
			navigate: function (t, e) {
				return i.history.navigate(t, e),
					this
			},
			_bindRoutes: function () {
				if (this.routes) {
					this.routes = o.result(this, "routes");
					for (var t, e = o.keys(this.routes); null != (t = e.pop());) this.route(t, this.routes[t])
				}
			},
			_routeToRegExp: function (t) {
				return t = t.replace(u, "\\$&").replace(s, "(?:$1)?").replace(a, function (t, e) {
					return e ? t : "([^/]+)"
				}).replace(c, "(.*?)"), new RegExp("^" + t + "$")
			},
			_extractParameters: function (t, e) {
				var n = t.exec(e).slice(1);
				return o.map(n, function (t) {
					return t ? decodeURIComponent(t) : null
				})
			}
		});
		var l = i.History = function () {
				this.handlers = [], o.bindAll(this, "checkUrl"), "undefined" != typeof window && (this.location = window.location, this.history = window.history)
			},
			p = /^[#\/]|\s+$/g,
			h = /^\/+|\/+$/g,
			d = /msie [\w.]+/,
			f = /\/$/;
		l.started = !1, o.extend(l.prototype, r.Events, {
			interval: 50,
			getHash: function (t) {
				var e = (t || this).location.href.match(/#(.*)$/);
				return e ? e[1] : ""
			},
			getFragment: function (t, e) {
				if (null == t)
					if (this._hasPushState || !this._wantsHashChange || e) {
						t = this.location.pathname;
						var n = this.root.replace(f, "");
						t.indexOf(n) || (t = t.substr(n.length))
					} else t = this.getHash();
				return t.replace(p, "")
			},
			start: function (t) {
				if (l.started) throw new Error("Router.history has already been started");
				l.started = !0, this.options = o.extend({}, {
					root: "/"
				}, this.options, t), this.root = this.options.root, this._wantsHashChange = this.options.hashChange !== !1, this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
				var e = this.getFragment(),
					n = document.documentMode,
					r = d.exec(navigator.userAgent.toLowerCase()) && (!n || 7 >= n);
				this.root = ("/" + this.root + "/").replace(h, "/"), r && this._wantsHashChange && (this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(e)), this._hasPushState ? $(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !r ? $(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = e;
				var i = this.location,
					s = i.pathname.replace(/[^\/]$/, "$&/") === this.root;
				return this._wantsHashChange && this._wantsPushState && !this._hasPushState && !s ? (this.fragment = this.getFragment(null, !0), this.location.replace(this.root + this.location.search + "#" + this.fragment), !0) : (this._wantsPushState && this._hasPushState && s && i.hash && (this.fragment = this.getHash().replace(p, ""), this.history.replaceState({}, document.title, this.root + this.fragment + i.search)), this.options.silent ? void 0 : this.loadUrl())
			},
			stop: function () {
				$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl), clearInterval(this._checkUrlInterval), l.started = !1
			},
			route: function (t, e) {
				this.handlers.unshift({
					route: t,
					callback: e
				})
			},
			checkUrl: function (t) {
				var e = this.getFragment();
				return e === this.fragment && this.iframe && (e = this.getFragment(this.getHash(this.iframe))), e === this.fragment ? !1 : (this.iframe && this.navigate(e), void(this.loadUrl() || this.loadUrl(this.getHash())))
			},
			loadUrl: function (t) {
				var e = this.fragment = this.getFragment(t),
					n = o.any(this.handlers, function (t) {
						return t.route.test(e) ? (t.callback(e), !0) : void 0
					});
				return n
			},
			navigate: function (t, e) {
				if (!l.started) return !1;
				if (e && e !== !0 || (e = {
						trigger: e
					}), t = this.getFragment(t || ""), this.fragment !== t) {
					this.fragment = t;
					var n = this.root + t;
					if (this._hasPushState) this.history[e.replace ? "replaceState" : "pushState"]({}, document.title, n);
					else {
						if (!this._wantsHashChange) return this.location.assign(n);
						this._updateHash(this.location, t, e.replace), this.iframe && t !== this.getFragment(this.getHash(this.iframe)) && (e.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, t, e.replace))
					}
					e.trigger && this.loadUrl(t)
				}
			},
			_updateHash: function (t, e, n) {
				if (n) {
					var r = t.href.replace(/(javascript:|#).*$/, "");
					t.replace(r + "#" + e)
				} else t.hash = "#" + e
			}
		}), i.history = new l, e.exports = i
	}, {
		"../../substance/util": 175,
		underscore: 124
	}],
	157: [function (t, e, n) {
		"use strict";
		var r = t("../../substance/util"),
			o = function (t) {
				t = t || {};
				this.el = t.el || window.document.createElement(t.elementType || "div"), this.$el = $(this.el), this.dispatchDOMEvents()
			};
		o.Prototype = function () {
			this.$ = function (t) {
				return this.$el.find(t)
			}, this.render = function () {
				return this
			}, this.dispatchDOMEvents = function () {
				function t(t) {
					var e = /(\w+)\((.*)\)/.exec(t);
					if (!e) throw new Error("Invalid click handler '" + t + "'");
					return {
						method: e[1],
						args: e[2].split(",")
					}
				}
				var e = this;
				this.$el.delegate("[sbs-click]", "click", function (n) {
					console.error("FIXME: sbs-click is deprecated. Use jquery handlers with selectors instead.");
					var r = t($(n.currentTarget).attr("sbs-click")),
						o = e[r.method];
					return o ? (n.stopPropagation(), n.preventDefault(), o.apply(e, r.args), !1) : void 0
				})
			}
		}, o.Prototype.prototype = r.Events, o.prototype = new o.Prototype, e.exports = o
	}, {
		"../../substance/util": 175
	}],
	158: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../../substance/util"),
			i = o.errors,
			s = t("./schema"),
			a = t("./property"),
			c = t("./graph_index"),
			u = i.define("GraphError"),
			l = ["object", "array", "string", "number", "boolean", "date"],
			p = function (t) {
				return r.isArray(t) && (t = t[0]), l.indexOf(t) >= 0
			},
			h = function (t, e) {
				if (e = e || {}, this.schema = new s(t), this.schema.id && e.seed && e.seed.schema && !r.isEqual(e.seed.schema, [this.schema.id, this.schema.version])) throw new u(["Graph does not conform to schema. Expected: ", this.schema.id + "@" + this.schema.version, " Actual: ", e.seed.schema[0] + "@" + e.seed.schema[1]].join(""));
				this.nodes = {}, this.indexes = {}, this.__seed__ = e.seed, this.init()
			};
		h.Prototype = function () {
			r.extend(this, o.Events), this.create = function (t) {
				this.nodes[t.id] = t, this._updateIndexes({
					type: "create",
					path: [t.id],
					val: t
				})
			}, this["delete"] = function (t) {
				var e = this.nodes[t];
				delete this.nodes[t], this._updateIndexes({
					type: "delete",
					path: [t],
					val: e
				})
			}, this.set = function (t, e) {
				var n = this.resolve(t);
				if (!n) throw new u("Could not resolve property with path " + JSON.stringify(t));
				var r = n.get();
				n.set(e), this._updateIndexes({
					type: "set",
					path: t,
					val: e,
					original: r
				})
			}, this.get = function (t) {
				if (!r.isArray(t) && !r.isString(t)) throw new u("Invalid argument path. Must be String or Array");
				if (arguments.length > 1 && (t = r.toArray(arguments)), r.isString(t)) return this.nodes[t];
				var e = this.resolve(t);
				return e.get()
			}, this.query = function (t) {
				var e = this.resolve(t),
					n = e.type,
					r = e.baseType,
					o = e.get();
				return "array" === r ? this._queryArray.call(this, o, n) : p(r) ? o : this.get(o)
			}, this.toJSON = function () {
				return {
					id: this.id,
					schema: [this.schema.id, this.schema.version],
					nodes: o.deepclone(this.nodes)
				}
			}, this.contains = function (t) {
				return !!this.nodes[t]
			}, this.resolve = function (t) {
				return new a(this, t)
			}, this.reset = function () {
				this.init(), this.trigger("graph:reset")
			}, this.init = function () {
				this.__is_initializing__ = !0, this.__seed__ ? this.nodes = o.clone(this.__seed__.nodes) : this.nodes = {}, r.each(this.indexes, function (t) {
					t.reset()
				}), delete this.__is_initializing__
			}, this.addIndex = function (t, e) {
				if (this.indexes[t]) throw new u("Index with name " + t + "already exists.");
				var n = new c(this, e);
				return this.indexes[t] = n, n
			}, this.removeIndex = function (t) {
				delete this.indexes[t]
			}, this._updateIndexes = function (t) {
				r.each(this.indexes, function (e) {
					t ? e.onGraphChange(t) : e.rebuild()
				}, this)
			}, this._queryArray = function (t, e) {
				if (!r.isArray(e)) throw new u("Illegal argument: array types must be specified as ['array'(, 'array')*, <type>]");
				var n, o;
				if ("array" === e[1])
					for (n = [], o = 0; o < t.length; o++) n.push(this._queryArray(t[o], e.slice(1)));
				else if (p(e[1])) n = t;
				else
					for (n = [], o = 0; o < t.length; o++) n.push(this.get(t[o]));
				return n
			}
		}, h.STRICT_INDEXING = 2, h.DEFAULT_MODE = h.STRICT_INDEXING, h.prototype = new h.Prototype, h.Schema = s, h.Property = a, h.Index = c, e.exports = h
	}, {
		"../../substance/util": 175,
		"./graph_index": 159,
		"./property": 161,
		"./schema": 162,
		underscore: 124
	}],
	159: [function (t, e, n) {
		var r = t("underscore"),
			o = t("../../substance/util"),
			i = function (t, e) {
				e = e || {}, this.graph = t, this.nodes = {}, this.scopes = {}, e.filter ? this.filter = e.filter : e.types && (this.filter = i.typeFilter(t.schema, e.types)), e.property && (this.property = e.property), this.createIndex()
			};
		i.Prototype = function () {
			var t = function (t) {
					var e = this;
					if (null !== t)
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							e.scopes[r] = e.scopes[r] || {
								nodes: {},
								scopes: {}
							}, e = e.scopes[r]
						}
					return e
				},
				e = function (t) {
					if (!this.property) return null;
					var e = t[this.property] ? t[this.property] : null;
					return r.isString(e) && (e = [e]), e
				},
				n = function (t) {
					var e = r.extend({}, t.nodes);
					return r.each(t.scopes, function (t, o) {
						"nodes" !== o && r.extend(e, n(t))
					}), e
				};
			this.onGraphChange = function (t) {
				this.applyOp(t)
			}, this._add = function (n) {
				if (!this.filter || this.filter(n)) {
					var r = e.call(this, n),
						o = t.call(this, r);
					o.nodes[n.id] = n.id
				}
			}, this._remove = function (n) {
				if (!this.filter || this.filter(n)) {
					var r = e.call(this, n),
						o = t.call(this, r);
					delete o.nodes[n.id]
				}
			}, this._update = function (e, n, o, i) {
				if (this.property === n && (!this.filter || this.filter(e))) {
					var s = i;
					r.isString(s) && (s = [s]);
					var a = t.call(this, s);
					delete a.nodes[e.id], s = o, a.nodes[e.id] = e.id
				}
			}, this.applyOp = function (t) {
				if ("create" === t.type) this._add(t.val);
				else if ("delete" === t.type) this._remove(t.val);
				else {
					var e, n = this.graph.resolve(this, t.path),
						r = n.get();
					if (void 0 === r) return;
					"set" === t.type ? e = t.original : console.error("Operational updates are not supported in this implementation"), this._update(n.node, n.key, r, e)
				}
			}, this.createIndex = function () {
				this.reset();
				var n = this.graph.nodes;
				r.each(n, function (n) {
					if (!this.filter || this.filter(n)) {
						var r = e.call(this, n),
							o = t.call(this, r);
						o.nodes[n.id] = n.id
					}
				}, this)
			}, this.get = function (e) {
				0 === arguments.length ? e = null : r.isString(e) && (e = [e]);
				var o = t.call(this, e),
					s = n(o),
					a = new i.Result;
				return r.each(s, function (t) {
					a[t] = this.graph.get(t)
				}, this), a
			}, this.reset = function () {
				this.nodes = {}, this.scopes = {}
			}, this.dispose = function () {
				this.stopListening()
			}, this.rebuild = function () {
				this.reset(), this.createIndex()
			}
		}, i.prototype = r.extend(new i.Prototype, o.Events.Listener), i.typeFilter = function (t, e) {
			return function (n) {
				for (var r = t.typeChain(n.type), o = 0; o < e.length; o++)
					if (r.indexOf(e[o]) >= 0) return !0;
				return !1
			}
		}, i.Result = function () {}, i.Result.prototype.asList = function () {
			var t = [];
			for (var e in this) t.push(this[e])
		}, i.Result.prototype.getLength = function () {
			return Object.keys(this).length
		}, e.exports = i
	}, {
		"../../substance/util": 175,
		underscore: 124
	}],
	160: [function (t, e, n) {
		"use strict";
		var r = {};
		r.VERSION = "0.8.0", r.Graph = t("./graph"), e.exports = r
	}, {
		"./graph": 158
	}],
	161: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = function (t, e) {
				if (!e) throw new Error("Illegal argument: path is null/undefined.");
				this.graph = t, this.schema = t.schema, r.extend(this, this.resolve(e))
			};
		o.Prototype = function () {
			this.resolve = function (t) {
				for (var e, n, r = this.graph, o = r, i = "graph", s = 0; s < t.length; s++)
					if ("graph" === i || void 0 !== this.schema.types[i]) {
						if (o = this.graph.get(t[s]), void 0 === o) return void 0;
						r = o, i = this.schema.properties(o.type), n = r, e = void 0
					} else {
						if (void 0 === o) return void 0;
						e = t[s];
						var a = t[s];
						i = i[a], n = o[e], s < t.length - 1 && (o = o[a])
					} return {
					node: r,
					parent: o,
					type: i,
					key: e,
					value: n
				}
			}, this.get = function () {
				return void 0 !== this.key ? this.parent[this.key] : this.node
			}, this.set = function (t) {
				if (void 0 === this.key) throw new Error("'set' is only supported for node properties.");
				this.parent[this.key] = this.schema.parseValue(this.baseType, t)
			}
		}, o.prototype = new o.Prototype, Object.defineProperties(o.prototype, {
			baseType: {
				get: function () {
					return r.isArray(this.type) ? this.type[0] : this.type
				}
			},
			path: {
				get: function () {
					return [this.node.id, this.key]
				}
			}
		}), e.exports = o
	}, {
		underscore: 124
	}],
	162: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../../substance/util"),
			i = function (t) {
				r.extend(this, t)
			};
		i.Prototype = function () {
			this.defaultValue = function (t) {
				return "object" === t ? {} : "array" === t ? [] : "string" === t ? "" : "number" === t ? 0 : "boolean" === t ? !1 : "date" === t ? new Date : null
			}, this.parseValue = function (t, e) {
				if (null === e) return e;
				if (r.isString(e)) {
					if ("object" === t) return JSON.parse(e);
					if ("array" === t) return JSON.parse(e);
					if ("string" === t) return e;
					if ("number" === t) return parseInt(e, 10);
					if ("boolean" === t) {
						if ("true" === e) return !0;
						if ("false" === e) return !1;
						throw new Error("Can not parse boolean value from: " + e)
					}
					return "date" === t ? new Date(e) : e
				}
				if ("array" === t) {
					if (!r.isArray(e)) throw new Error("Illegal value type: expected array.");
					e = o.deepclone(e)
				} else if ("string" === t) {
					if (!r.isString(e)) throw new Error("Illegal value type: expected string.")
				} else if ("object" === t) {
					if (!r.isObject(e)) throw new Error("Illegal value type: expected object.");
					e = o.deepclone(e)
				} else if ("number" === t) {
					if (!r.isNumber(e)) throw new Error("Illegal value type: expected number.")
				} else if ("boolean" === t) {
					if (!r.isBoolean(e)) throw new Error("Illegal value type: expected boolean.")
				} else {
					if ("date" !== t) throw new Error("Unsupported value type: " + t);
					e = new Date(e)
				}
				return e
			}, this.type = function (t) {
				return this.types[t]
			}, this.typeChain = function (t) {
				var e = this.types[t];
				if (!e) throw new Error("Type " + t + " not found in schema");
				var n = e.parent ? this.typeChain(e.parent) : [];
				return n.push(t), n
			}, this.isInstanceOf = function (t, e) {
				var n = this.typeChain(t);
				return n && n.indexOf(e) >= 0 ? !0 : !1
			}, this.baseType = function (t) {
				return this.typeChain(t)[0]
			}, this.properties = function (t) {
				t = r.isObject(t) ? t : this.type(t);
				var e = t.parent ? this.properties(t.parent) : {};
				return r.extend(e, t.properties), e
			}, this.propertyType = function (t, e) {
				var n = this.properties(t),
					o = n[e];
				if (!o) throw new Error("Property not found for" + t + "." + e);
				return r.isArray(o) ? o : [o]
			}, this.propertyBaseType = function (t, e) {
				return this.propertyType(t, e)[0]
			}
		}, i.prototype = new i.Prototype, e.exports = i
	}, {
		"../../substance/util": 175,
		underscore: 124
	}],
	163: [function (t, e, n) {
		var r = t("./node"),
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.type = {
			id: "composite",
			parent: "content",
			properties: {}
		}, o.description = {
			name: "Composite",
			remarks: ["A file reference to an external resource."],
			properties: {}
		}, o.example = {
			no_example: "yet"
		}, o.Prototype = function () {
			this.getLength = function () {
				throw new Error("Composite.getLength() is abstract.")
			}, this.getNodes = function () {
				return this.getChildrenIds()
			}, this.getChildrenIds = function () {
				throw new Error("Composite.getChildrenIds() is abstract.")
			}, this.isMutable = function () {
				return !1
			}, this.insertOperation = function () {
				return null
			}, this.deleteOperation = function () {
				return null
			}, this.insertChild = function () {
				throw new Error("This composite is immutable.")
			}, this.deleteChild = function () {
				throw new Error("This composite is immutable.")
			}, this.getChangePosition = function (t) {
				return 0
			}
		}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, e.exports = o
	}, {
		"./node": 168
	}],
	164: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../../substance/util"),
			i = t("./composite"),
			s = function (t, e) {
				this.document = t, this.view = e, this.treeView = [], this.listView = [], this.__parents = {}, this.__composites = {}, this.rebuild()
			};
		s.Prototype = function () {
			var t = function (t, e) {
				var n, r = [];
				for (n = this.treeView.length - 1; n >= 0; n--) r.unshift({
					id: this.treeView[n],
					parent: null
				});
				for (var o, s; r.length > 0;) {
					if (o = r.shift(), s = this.document.get(o.id), s instanceof i) {
						var a = s.getNodes();
						for (n = a.length - 1; n >= 0; n--) r.unshift({
							id: a[n],
							parent: s.id
						})
					}
					t.call(e, s, o.parent)
				}
			};
			this.rebuild = function () {
				this.treeView.splice(0, this.treeView.length), this.listView.splice(0, this.listView.length), this.treeView = r.clone(this.view.nodes);
				for (var e = 0; e < this.view.length; e++) this.treeView.push(this.view[e]);
				this.__parents = {}, this.__composites = {}, t.call(this, function (t, e) {
					if (t instanceof i) this.__parents[t.id] = e, this.__composites[e] = e;
					else {
						if (this.listView.push(t.id), this.__parents[t.id]) throw new Error("Nodes must be unique in one view.");
						this.__parents[t.id] = e, this.__composites[e] = e
					}
				}, this)
			}, this.getTopLevelNodes = function () {
				return r.map(this.treeView, function (t) {
					return this.document.get(t)
				}, this)
			}, this.getNodes = function (t) {
				var e = this.listView;
				if (t) return r.clone(e);
				for (var n = [], o = 0; o < e.length; o++) n.push(this.document.get(e[o]));
				return n
			}, this.getPosition = function (t) {
				var e = this.listView;
				return e.indexOf(t)
			}, this.getNodeFromPosition = function (t) {
				var e = this.listView,
					n = e[t];
				return void 0 !== n ? this.document.get(n) : null
			}, this.getParent = function (t) {
				return this.__parents[t]
			}, this.getRoot = function (t) {
				for (var e = t; e;) t = e, e = this.getParent(t);
				return t
			}, this.update = function (t) {
				var e = t.path,
					n = e[0] === this.view.id || void 0 !== this.__composites[e[0]];
				n && this.rebuild()
			}, this.getLength = function () {
				return this.listView.length
			}, this.hasSuccessor = function (t) {
				var e = this.getLength();
				return e - 1 > t
			}, this.hasPredecessor = function (t) {
				return t > 0
			}, this.getPredecessor = function (t) {
				var e = this.getPosition(t);
				return 0 >= e ? null : this.getNodeFromPosition(e - 1)
			}, this.getSuccessor = function (t) {
				var e = this.getPosition(t);
				return e >= this.getLength() - 1 ? null : this.getNodeFromPosition(e + 1)
			}, this.firstChild = function (t) {
				if (t instanceof i) {
					var e = this.document.get(t.getNodes()[0]);
					return this.firstChild(e)
				}
				return t
			}, this.lastChild = function (t) {
				if (t instanceof i) {
					var e = this.document.get(r.last(t.getNodes()));
					return this.lastChild(e)
				}
				return t
			}, this.before = function (t) {
				var e = this.firstChild(t),
					n = this.getPosition(e.id);
				return [n, 0]
			}, this.after = function (t) {
				var e = this.lastChild(t),
					n = this.getPosition(e.id),
					r = e.getLength();
				return [n, r]
			}
		}, s.prototype = r.extend(new s.Prototype, o.Events.Listener), Object.defineProperties(s.prototype, {
			id: {
				get: function () {
					return this.view.id
				}
			},
			type: {
				get: function () {
					return this.view.type
				}
			},
			nodes: {
				get: function () {
					return this.view.nodes
				},
				set: function (t) {
					this.view.nodes = t
				}
			}
		}), e.exports = s
	}, {
		"../../substance/util": 175,
		"./composite": 163,
		underscore: 124
	}],
	165: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../../substance/util"),
			i = function (t, e) {
				e = e || {}, this.view = e.view || "content", this.__document = t, this.container = t.get(this.view)
			};
		i.Prototype = function () {
			this.getNodes = function (t) {
				return this.container.getNodes(t)
			}, this.getContainer = function () {
				return this.container
			}, this.getPosition = function (t, e) {
				return this.container.getPosition(t, e)
			}, this.getNodeFromPosition = function (t) {
				return this.container.getNodeFromPosition(t)
			}, this.getAnnotations = function (t) {
				return t = t || {}, t.view = this.view, this.annotator.getAnnotations(t)
			}, this.get = function () {
				return this.__document.get.apply(this.__document, arguments)
			}, this.on = function () {
				return this.__document.on.apply(this.__document, arguments)
			}, this.off = function () {
				return this.__document.off.apply(this.__document, arguments)
			}, this.getDocument = function () {
				return this.__document
			}
		}, i.prototype = r.extend(new i.Prototype, o.Events.Listener), Object.defineProperties(i.prototype, {
			id: {
				get: function () {
					return this.__document.id
				},
				set: function () {
					throw "immutable property"
				}
			},
			nodeTypes: {
				get: function () {
					return this.__document.nodeTypes
				},
				set: function () {
					throw "immutable property"
				}
			},
			title: {
				get: function () {
					return this.__document.get("document").title
				},
				set: function () {
					throw "immutable property"
				}
			},
			updated_at: {
				get: function () {
					return this.__document.get("document").updated_at
				},
				set: function () {
					throw "immutable property"
				}
			},
			creator: {
				get: function () {
					return this.__document.get("document").creator
				},
				set: function () {
					throw "immutable property"
				}
			}
		}), e.exports = i
	}, {
		"../../substance/util": 175,
		underscore: 124
	}],
	166: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = t("../../substance/util"),
			i = o.errors,
			s = t("../../substance/data"),
			a = t("./container"),
			c = i.define("DocumentError"),
			u = function (t) {
				s.Graph.call(this, t.schema, t), this.containers = {}, this.addIndex("annotations", {
					types: ["annotation"],
					property: "path"
				})
			};
		u.schema = {
			indexes: {},
			types: {
				content: {
					properties: {}
				},
				view: {
					properties: {
						nodes: ["array", "content"]
					}
				}
			}
		}, u.Prototype = function () {
			var t = o.prototype(this);
			this.getIndex = function (t) {
				return this.indexes[t]
			}, this.getSchema = function () {
				return this.schema
			}, this.create = function (e) {
				return t.create.call(this, e), this.get(e.id)
			}, this.get = function (e) {
				var n = t.get.call(this, e);
				if (!n) return n;
				if ("view" === n.type) return this.containers[n.id] || (this.containers[n.id] = new a(this, n)), this.containers[n.id];
				var r = this.nodeTypes[n.type],
					o = void 0 !== r ? r.Model : null;
				return !o || n instanceof o || (n = new o(n, this), this.nodes[n.id] = n), n
			}, this.toJSON = function () {
				var e = t.toJSON.call(this);
				return e.id = this.id, e
			}, this.hide = function (t, e) {
				var n = this.get(t);
				if (!n) throw new c("Invalid view id: " + t);
				r.isString(e) && (e = [e]);
				var o = [];
				if (r.each(e, function (t) {
						var e = n.nodes.indexOf(t);
						e >= 0 && o.push(e)
					}, this), 0 !== o.length) {
					o = o.sort().reverse(), o = r.uniq(o);
					for (var i = this.nodes[t], s = 0; s < o.length; s++) i.nodes.splice(o[s], 1)
				}
			}, this.show = function (t, e, n) {
				void 0 === n && (n = -1);
				var r = this.get(t);
				if (!r) throw new c("Invalid view id: " + t);
				var o = r.nodes.length;
				n = Math.min(n, o), 0 > n && (n = Math.max(0, o + n + 1)), r.nodes.splice(n, 0, e)
			}, this.fromSnapshot = function (t, e) {
				return u.fromSnapshot(t, e)
			}, this.uuid = function (t) {
				return t + "_" + o.uuid()
			}
		}, u.Prototype.prototype = s.Graph.prototype, u.prototype = new u.Prototype, u.fromSnapshot = function (t, e) {
			return e = e || {}, e.seed = t, new u(e)
		}, u.DocumentError = c, e.exports = u
	}, {
		"../../substance/data": 160,
		"../../substance/util": 175,
		"./container": 164,
		underscore: 124
	}],
	167: [function (t, e, n) {
		"use strict";
		var r = (t("underscore"), t("./document"));
		r.Container = t("./container"), r.Controller = t("./controller"), r.Node = t("./node"), r.Composite = t("./composite"), r.TextNode = t("./text_node"), e.exports = r
	}, {
		"./composite": 163,
		"./container": 164,
		"./controller": 165,
		"./document": 166,
		"./node": 168,
		"./text_node": 169,
		underscore: 124
	}],
	168: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = function (t, e) {
				this.document = e, this.properties = t
			};
		o.type = {
			parent: "content",
			properties: {}
		}, o.properties = {
			"abstract": !0,
			immutable: !0,
			mergeableWith: [],
			preventEmpty: !0,
			allowedAnnotations: []
		}, o.Prototype = function () {
			this.toJSON = function () {
				return r.clone(this.properties)
			}, this.getLength = function () {
				throw new Error("Node.getLength() is abstract.")
			}, this.getChangePosition = function (t) {
				throw new Error("Node.getCharPosition() is abstract.")
			}, this.insertOperation = function (t, e) {
				throw new Error("Node.insertOperation() is abstract.")
			}, this.deleteOperation = function (t, e) {
				throw new Error("Node.deleteOperation() is abstract.")
			}, this.canJoin = function (t) {
				return !1
			}, this.join = function (t) {
				throw new Error("Node.join() is abstract.")
			}, this.isBreakable = function () {
				return !1
			}, this["break"] = function (t, e) {
				throw new Error("Node.split() is abstract.")
			}, this.getAnnotations = function () {
				return this.document.getIndex("annotations").get(this.properties.id)
			}, this.includeInToc = function () {
				return !1
			}
		}, o.prototype = new o.Prototype, o.prototype.constructor = o, o.defineProperties = function (t, e, n) {
			var o = t;
			if (1 === arguments.length) {
				var i = t;
				if (o = i.prototype, !o || !i.type) throw new Error("Illegal argument: expected NodeClass");
				e = Object.keys(i.type.properties)
			}
			r.each(e, function (t) {
				var e = {
					get: function () {
						return this.properties[t]
					}
				};
				n || (e.set = function (e) {
					return this.properties[t] = e, this
				}), Object.defineProperty(o, t, e)
			})
		}, o.defineProperties(o.prototype, ["id", "type"]), e.exports = o
	}, {
		underscore: 124
	}],
	169: [function (t, e, n) {
		"use strict";
		var r = t("./node"),
			o = function (t, e) {
				r.call(this, t, e)
			};
		o.type = {
			id: "text",
			parent: "content",
			properties: {
				source_id: "Text element source id",
				content: "string"
			}
		}, o.description = {
			name: "Text",
			remarks: ["A simple text fragement that can be annotated. Usually text nodes are combined in a paragraph."],
			properties: {
				content: "Content"
			}
		}, o.example = {
			type: "paragraph",
			id: "paragraph_1",
			content: "Lorem ipsum dolor sit amet, adipiscing elit."
		}, o.Prototype = function () {
			this.getLength = function () {
				return this.properties.content.length
			}
		}, o.Prototype.prototype = r.prototype, o.prototype = new o.Prototype, o.prototype.constructor = o, r.defineProperties(o.prototype, ["content"]), e.exports = o
	}, {
		"./node": 168
	}],
	170: [function (t, e, n) {
		"use strict";

		function r(t, e) {
			function n(t) {
				var e = a[c];
				if (!e) return l.length > 0 ? r(new Error("Multiple errors occurred.", t)) : r(null, t);
				var o = i.once(function (t, e) {
					if (t) {
						if (u) return r(t, null);
						l.push(t)
					}
					c += 1, n(e)
				});
				try {
					0 === e.length ? (e(), o(null, t)) : 1 === e.length ? e(o) : e(t, o)
				} catch (p) {
					console.log("util.async caught error:", p), s.printStackTrace(p), r(p)
				}
			}
			var r = t["finally"] || function (t, n) {
				e(t, n)
			};
			r = i.once(r);
			var o = t.data || {},
				a = t.functions;
			if (!i.isFunction(e)) return e("Illegal arguments: a callback function must be provided");
			var c = 0,
				u = void 0 === t.stopOnError ? !0 : t.stopOnError,
				l = [];
			n(o)
		}

		function o(t) {
			return function (e, n) {
				function o(t, e) {
					return function (n, r) {
						2 === p.length ? p(t, r) : 3 === p.length ? p(t, e, r) : p(t, e, n, r)
					}
				}

				function s(t, e) {
					return function (n, r) {
						2 === p.length ? p(t, r) : 3 === p.length ? p(t, e, r) : p(t, e, n, r)
					}
				}
				var a = t.selector ? t.selector(e) : t.items,
					c = t["finally"] || function (t, e) {
						n(t, e)
					};
				if (c = i.once(c), !a) return c(null, e);
				var u = i.isArray(a);
				t.before && t.before(e);
				var l = [],
					p = t.iterator;
				if (u)
					for (var h = 0; h < a.length; h++) l.push(o(a[h], h));
				else
					for (var d in a) l.push(s(a[d], d));
				var f = {
					functions: l,
					data: e,
					"finally": c,
					stopOnError: t.stopOnError
				};
				r(f, n)
			}
		}
		var i = t("underscore"),
			s = t("./util.js"),
			a = {};
		a.sequential = function (t, e) {
			i.isArray(t) && (t = {
				functions: t
			}), r(t, e)
		}, a.iterator = function (t, e) {
			var n;
			return n = 1 == arguments.length ? t : {
				items: t,
				iterator: e
			}, o(n)
		}, a.each = function (t, e) {
			var n = o(t);
			n(null, e)
		}, e.exports = a
	}, {
		"./util.js": 177,
		underscore: 124
	}],
	171: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = {};
		o.ChildNodeIterator = function (t) {
			r.isArray(t) ? this.nodes = t : this.nodes = t.childNodes, this.length = this.nodes.length, this.pos = -1
		}, o.ChildNodeIterator.prototype = {
			hasNext: function () {
				return this.pos < this.length - 1
			},
			next: function () {
				return this.pos += 1, this.nodes[this.pos]
			},
			back: function () {
				return this.pos >= 0 && (this.pos -= 1), this
			}
		}, o.getChildren = function (t) {
			if (void 0 !== t.children) return t.children;
			for (var e = [], n = t.firstElementChild; n;) e.push(n), n = n.nextElementSibling;
			return e
		}, o.getNodeType = function (t) {
			return t.nodeType === window.Node.TEXT_NODE ? "text" : t.nodeType === window.Node.COMMENT_NODE ? "comment" : t.tagName ? t.tagName.toLowerCase() : (console.error("Can't get node type for ", t), "unknown")
		}, e.exports = o
	}, {
		underscore: 124
	}],
	172: [function (t, e, n) {
		"use strict";
		var r = t("./util"),
			o = {},
			i = function (t, e) {
				e ? (Error.call(this, t, e.fileName, e.lineNumber), e instanceof i ? this.__stack = e.__stack : e.stack ? this.__stack = r.parseStackTrace(e) : this.__stack = r.callstack(1)) : (Error.call(this, t), this.__stack = r.callstack(1)), this.message = t
			};
		i.Prototype = function () {
			this.name = "SubstanceError", this.code = -1, this.toString = function () {
				return this.name + ":" + this.message
			}, this.toJSON = function () {
				return {
					name: this.name,
					message: this.message,
					code: this.code,
					stack: this.stack
				}
			}, this.printStackTrace = function () {
				r.printStackTrace(this)
			}
		}, i.Prototype.prototype = Error.prototype, i.prototype = new i.Prototype, Object.defineProperty(i.prototype, "stack", {
			get: function () {
				for (var t = [], e = 0; e < this.__stack.length; e++) {
					var n = this.__stack[e];
					t.push(n.file + ":" + n.line + ":" + n.col + " (" + n.func + ")")
				}
				return t.join("\n")
			},
			set: function () {
				throw new Error("SubstanceError.stack is read-only.")
			}
		}), o.SubstanceError = i;
		var s = function (t, e, n) {
			return function (r) {
				t.call(this, r), this.name = e, this.code = n
			}
		};
		o.define = function (t, e, n) {
			if (!t) throw new i("Name is required.");
			void 0 === e && (e = -1), n = n || i;
			var r = s(n, t, e),
				a = function () {};
			return a.prototype = n.prototype, r.prototype = new a, r.prototype.constructor = r, o[t] = r, r
		}, e.exports = o
	}, {
		"./util": 177
	}],
	173: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = 1,
			i = -1,
			s = function (t) {
				this.levels = t || {}
			};
		s.Prototype = function () {
			var t = function (t, e) {
					if (t.pos < e.pos) return -1;
					if (t.pos > e.pos) return 1;
					if (t.mode < e.mode) return -1;
					if (t.mode > e.mode) return 1;
					if (t.mode === o) {
						if (t.level < e.level) return -1;
						if (t.level > e.level) return 1
					}
					if (t.mode === i) {
						if (t.level > e.level) return -1;
						if (t.level < e.level) return 1
					}
					return 0
				},
				e = function (t) {
					var e = [];
					return r.each(t, function (t) {
						var n = this.levels[t.type] || 1e3;
						void 0 !== n && (e.push({
							pos: t.range[0],
							mode: o,
							level: n,
							id: t.id,
							type: t.type,
							node: t
						}), e.push({
							pos: t.range[1],
							mode: i,
							level: n,
							id: t.id,
							type: t.type,
							node: t
						}))
					}, this), e
				};
			this.onText = function () {}, this.onEnter = function () {
				return null
			}, this.onExit = function () {}, this.enter = function (t, e) {
				return this.onEnter(t, e)
			}, this.exit = function (t, e) {
				this.onExit(t, e)
			}, this.createText = function (t, e) {
				this.onText(t, e)
			}, this.start = function (n, r, s) {
				var a = e.call(this, s);
				a.sort(t.bind(this));
				for (var c = [{
						context: n,
						entry: null
					}], u = 0, l = 0; l < a.length; l++) {
					var p = a[l];
					this.createText(c[c.length - 1].context, r.substring(u, p.pos)), u = p.pos;
					var h, d = 1;
					if (p.mode === o) {
						for (; d < c.length && !(p.level < c[d].entry.level); d++);
						c.splice(d, 0, {
							entry: p
						})
					} else if (p.mode === i) {
						for (; d < c.length && c[d].entry.id !== p.id; d++);
						for (h = d; h < c.length; h++) this.exit(c[h].entry, c[h - 1].context);
						c.splice(d, 1)
					}
					for (h = d; h < c.length; h++) c[h].context = this.enter(c[h].entry, c[h - 1].context)
				}
				this.createText(n, r.substring(u))
			}
		}, s.prototype = new s.Prototype, e.exports = s
	}, {
		underscore: 124
	}],
	174: [function (t, e, n) {
		"use strict";
		var r = {},
			o = t("underscore");
		r.templates = {}, r.renderTemplate = function (t, e) {
			return r.templates[t](e)
		}, "undefined" != typeof window && (window.console || (window.console = {
			log: function () {}
		})), r.tpl = function (t, e) {
			e = e || {};
			var n = window.$("script[name=" + t + "]").html();
			return o.template(n, e)
		}, e.exports = r
	}, {
		underscore: 124
	}],
	175: [function (t, e, n) {
		"use strict";
		var r = t("./util");
		r.async = t("./async"), r.errors = t("./errors"), r.html = t("./html"), r.dom = t("./dom"), r.RegExp = t("./regexp"), r.Fragmenter = t("./fragmenter"), e.exports = r
	}, {
		"./async": 170,
		"./dom": 171,
		"./errors": 172,
		"./fragmenter": 173,
		"./html": 174,
		"./regexp": 176,
		"./util": 177
	}],
	176: [function (t, e, n) {
		"use strict";
		var r = function (t) {
			this.index = t.index, this.match = [];
			for (var e = 0; e < t.length; e++) this.match.push(t[e])
		};
		r.Prototype = function () {
			this.captures = function () {
				return this.match.slice(1)
			}, this.toString = function () {
				return this.match[0]
			}
		}, r.prototype = new r.Prototype;
		var o = function (t) {
			this.exp = t
		};
		o.Prototype = function () {
			this.match = function (t) {
				if (void 0 === t) throw new Error("No string given");
				if (this.exp.global) {
					var e, n = [];
					for (this.exp.compile(this.exp); null !== (e = this.exp.exec(t));) n.push(new r(e));
					return n
				}
				return this.exp.exec(t)
			}
		}, o.prototype = new o.Prototype, o.Match = r, e.exports = o
	}, {}],
	177: [function (t, e, n) {
		"use strict";
		var r = t("underscore"),
			o = {};
		o.uuid = function (t, e) {
			var n, r = "0123456789abcdefghijklmnopqrstuvwxyz".split(""),
				o = [],
				i = 16;
			if (e = e || 32)
				for (n = 0; e > n; n++) o[n] = r[0 | Math.random() * i];
			else {
				var s;
				for (o[8] = o[13] = o[18] = o[23] = "-", o[14] = "4", n = 0; 36 > n; n++) o[n] || (s = 0 | 16 * Math.random(), o[n] = r[19 == n ? 3 & s | 8 : s])
			}
			return (t ? t : "") + o.join("")
		}, o.uuidGen = function (t) {
			var e = 1;
			return t = void 0 !== t ? t : "uuid_",
				function (n) {
					return n = n || t, n + e++
				}
		};
		var i = function (t, e) {
				var n, r = -1,
					o = t.length,
					i = e[0],
					s = e[1],
					a = e[2];
				switch (e.length) {
					case 0:
						for (; ++r < o;)(n = t[r]).callback.call(n.ctx);
						return;
					case 1:
						for (; ++r < o;)(n = t[r]).callback.call(n.ctx, i);
						return;
					case 2:
						for (; ++r < o;)(n = t[r]).callback.call(n.ctx, i, s);
						return;
					case 3:
						for (; ++r < o;)(n = t[r]).callback.call(n.ctx, i, s, a);
						return;
					default:
						for (; ++r < o;)(n = t[r]).callback.apply(n.ctx, e)
				}
			},
			s = /\s+/,
			a = function (t, e, n, r) {
				if (!n) return !0;
				if ("object" == typeof n) {
					for (var o in n) t[e].apply(t, [o, n[o]].concat(r));
					return !1
				}
				if (s.test(n)) {
					for (var i = n.split(s), a = 0, c = i.length; c > a; a++) t[e].apply(t, [i[a]].concat(r));
					return !1
				}
				return !0
			};
		o.Events = {
			on: function (t, e, n) {
				if (!a(this, "on", t, [e, n]) || !e) return this;
				this._events = this._events || {};
				var r = this._events[t] || (this._events[t] = []);
				return r.push({
					callback: e,
					context: n,
					ctx: n || this
				}), this
			},
			once: function (t, e, n) {
				if (!a(this, "once", t, [e, n]) || !e) return this;
				var o = this,
					i = r.once(function () {
						o.off(t, i), e.apply(this, arguments)
					});
				return i._callback = e, this.on(t, i, n)
			},
			off: function (t, e, n) {
				var o, i, s, c, u, l, p, h;
				if (!this._events || !a(this, "off", t, [e, n])) return this;
				if (!t && !e && !n) return this._events = {}, this;
				for (c = t ? [t] : r.keys(this._events), u = 0, l = c.length; l > u; u++)
					if (t = c[u], s = this._events[t]) {
						if (this._events[t] = o = [], e || n)
							for (p = 0, h = s.length; h > p; p++) i = s[p], (e && e !== i.callback && e !== i.callback._callback || n && n !== i.context) && o.push(i);
						o.length || delete this._events[t]
					} return this
			},
			trigger: function (t) {
				if (!this._events) return this;
				var e = Array.prototype.slice.call(arguments, 1);
				if (!a(this, "trigger", t, e)) return this;
				var n = this._events[t],
					r = this._events.all;
				return n && i(n, e), r && i(r, arguments), this
			},
			triggerLater: function () {
				var t = this,
					e = arguments;
				window.setTimeout(function () {
					t.trigger.apply(t, e)
				}, 0)
			},
			stopListening: function (t, e, n) {
				var r = this._listeners;
				if (!r) return this;
				var o = !e && !n;
				"object" == typeof e && (n = this), t && ((r = {})[t._listenerId] = t);
				for (var i in r) r[i].off(e, n, this), o && delete this._listeners[i];
				return this
			}
		};
		var c = {
			listenTo: "on",
			listenToOnce: "once"
		};
		r.each(c, function (t, e) {
			o.Events[e] = function (e, n, o) {
				var i = this._listeners || (this._listeners = {}),
					s = e._listenerId || (e._listenerId = r.uniqueId("l"));
				return i[s] = e, "object" == typeof n && (o = this), e[t](n, o, this), this
			}
		}), o.Events.bind = o.Events.on, o.Events.unbind = o.Events.off, o.Events.Listener = {
			listenTo: function (t, e, n) {
				if (!r.isFunction(n)) throw new Error("Illegal argument: expecting function as callback, was: " + n);
				return this._handlers = this._handlers || [], t.on(e, n, this), this._handlers.push({
					unbind: function () {
						t.off(e, n);
					}
				}), this
			},
			stopListening: function () {
				if (this._handlers)
					for (var t = 0; t < this._handlers.length; t++) this._handlers[t].unbind()
			}
		}, o.propagate = function (t, e) {
			if (!r.isFunction(e)) throw "Illegal argument: provided callback is not a function";
			return function (n) {
				return n ? e(n) : void e(null, t)
			}
		};
		var u = function () {};
		o.inherits = function (t, e, n) {
			var o;
			return o = e && e.hasOwnProperty("constructor") ? e.constructor : function () {
				t.apply(this, arguments)
			}, r.extend(o, t), u.prototype = t.prototype, o.prototype = new u, e && r.extend(o.prototype, e), n && r.extend(o, n), o.prototype.constructor = o, o.__super__ = t.prototype, o
		}, o.getJSON = function (e, n) {
			if ("undefined" == typeof window || "undefined" != typeof nwglobal) {
				var r = t("fs"),
					o = JSON.parse(r.readFileSync(e, "utf8"));
				n(null, o)
			} else {
				var i = window.$;
				i.getJSON(e).done(function (t) {
					n(null, t)
				}).error(function (t) {
					n(t, null)
				})
			}
		}, o.prototype = function (t) {
			return Object.getPrototypeOf ? Object.getPrototypeOf(t) : t.__proto__
		}, o.inherit = function (t, e) {
			var n, o = r.isFunction(t) ? new t : t;
			if (r.isFunction(e)) e.prototype = o, n = new e;
			else {
				var i = function () {};
				i.prototype = o, n = r.extend(new i, e)
			}
			return n
		}, o.pimpl = function (t) {
			var e = function (t) {
				this.self = t
			};
			return e.prototype = t,
				function (t) {
					return t = t || this, new e(t)
				}
		}, o.parseStackTrace = function (t) {
			var e, n = /([^@]*)@(.*):(\d+)/,
				r = /\s*at ([^(]*)[(](.*):(\d+):(\d+)[)]/,
				o = t.stack.split("\n"),
				i = [];
			for (e = 0; e < o.length; e++) {
				var s = n.exec(o[e]);
				s || (s = r.exec(o[e]));
				var a;
				s ? (a = {
					func: s[1],
					file: s[2],
					line: s[3],
					col: s[4] || 0
				}, "" === a.func && (a.func = "<anonymous>")) : a = {
					func: "",
					file: o[e],
					line: "",
					col: ""
				}, i.push(a)
			}
			return i
		}, o.callstack = function (t) {
			var e;
			try {
				throw new Error
			} catch (n) {
				e = n
			}
			var r = o.parseStackTrace(e);
			return t = t || 0, r.splice(t + 1)
		}, o.stacktrace = function (t) {
			var e = 0 === arguments.length ? o.callstack().splice(1) : o.parseStackTrace(t),
				n = [];
			return r.each(e, function (t) {
				n.push(t.file + ":" + t.line + ":" + t.col + " (" + t.func + ")")
			}), n.join("\n")
		}, o.printStackTrace = function (t, e) {
			if (t.stack) {
				var n;
				if (void 0 !== t.__stack) n = t.__stack;
				else {
					if (!r.isString(t.stack)) return;
					n = o.parseStackTrace(t)
				}
				e = e || n.length, e = Math.min(e, n.length);
				for (var i = 0; e > i; i++) {
					var s = n[i];
					console.log(s.file + ":" + s.line + ":" + s.col, "(" + s.func + ")")
				}
			}
		}, o.diff = function (t, e) {
			var n;
			return r.isArray(t) && r.isArray(e) ? (n = r.difference(e, t), 0 === n.length ? null : n) : r.isObject(t) && r.isObject(e) ? (n = {}, r.each(Object.keys(e), function (r) {
				var i = o.diff(t[r], e[r]);
				i && (n[r] = i)
			}), r.isEmpty(n) ? null : n) : t !== e ? e : void 0
		}, o.deepclone = function (t) {
			return void 0 === t ? void 0 : null === t ? null : JSON.parse(JSON.stringify(t))
		}, o.clone = function (t) {
			return null === t || void 0 === t ? t : r.isFunction(t.clone) ? t.clone() : o.deepclone(t)
		}, o.freeze = function (t) {
			var e;
			if (r.isObject(t)) {
				if (Object.isFrozen(t)) return t;
				var n = Object.keys(t);
				for (e = 0; e < n.length; e++) {
					var i = n[e];
					t[i] = o.freeze(t[i])
				}
				return Object.freeze(t)
			}
			if (r.isArray(t)) {
				var s = t;
				for (e = 0; e < s.length; e++) s[e] = o.freeze(s[e]);
				return Object.freeze(s)
			}
			return t
		}, o.later = function (t, e) {
			return function () {
				var n = arguments;
				window.setTimeout(function () {
					t.apply(e, n)
				}, 0)
			}
		}, o.isEmpty = function (t) {
			return !t.match(/\w/)
		}, o.slug = function (t) {
			t = t.replace(/^\s+|\s+$/g, ""), t = t.toLowerCase();
			for (var e = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;", n = "aaaaeeeeiiiioooouuuunc------", r = 0, o = e.length; o > r; r++) t = t.replace(new RegExp(e.charAt(r), "g"), n.charAt(r));
			return t = t.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
		}, o.getReadableFileSizeString = function (t) {
			var e = -1,
				n = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
			do t /= 1024, e++; while (t > 1024);
			return Math.max(t, .1).toFixed(1) + n[e]
		}, e.exports = o
	}, {
		fs: 3,
		underscore: 124
	}]
}, {}, [1]);
