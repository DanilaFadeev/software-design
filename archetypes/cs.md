---
title: "{{ replace .Name "-" " " | title }}"
description: ""
lead: ""
date: {{ .Date }}
lastmod: {{ .Date }}
draft: false
menu:
  computer-science:
    parent: ""
    identifier: "{{ .Name }}-{{ delimit (shuffle (split (md5 .Name) "" )) "" }}"
weight: 999
toc: true
type: docs
layout: single
---
