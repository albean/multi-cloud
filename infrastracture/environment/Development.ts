#!/usr/bin/env ts-node

import { Application } from "infrastracture/application";
import "infrastracture/clouds/local"

Application({ domain: `localhost.tv` })

